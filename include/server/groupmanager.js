const Group = require('../database/models/group');
const redis = require('../redis');
const config = require('../utils/config');

class GroupManager {
  constructor() {
    if (!!GroupManager.instance) {
      return GroupManager.instance;
    }

    this.mergedRoutes = [];
    this.groups = [];
    this.mappedGroups = {};
    this.redis = redis;

    if (typeof config.log.logger === 'string') {
      if (config.log.logger === 'wog') {
        var a = { ...config.log };

        a.logger = console;
        config.log.logger = require(config.log.logger)(a);
      } else {
        //console.log(config.log.logger);
        // config.log.logger = require(config.log.logger);
      }
    }
    this.log = config.log.logger;

    GroupManager.instance = this;
    return this;
  }

  async updateGroupList() {
    this.log.debug('Updating Groups');
    var grps = await Group.findAll();

    this.mappedGroups = {};
    this.groups = [];

    for (var i = 0; i < grps.length; i++) {
      this.groups.push(grps[i]);
      this.mappedGroups[grps[i].id] = new Group(grps[i]._);

      if (!this.mergedRoutes[grps[i].type]) {
        this.mergedRoutes[grps[i].type] = {};
      }

      this.mergedRoutes[grps[i].type][grps[i].name] = this.groupInheritedMerge(new Group(grps[i]._), grps);
    }

    this.redis.needsGroupUpdate = false;
  }

  async currentGroup(req, res) {
    await this.updateGroupsIfNeeeded();

    if (!req.isAuthenticated) {
      return [{ routes: this.mergedRoutes['group']['anonymous'], group: { name: 'anonymous', type: 'group' } }];
    }

    var mroutes = [];

    for (var i = 0; i < req.session.data.user.groups.length; i++) {
      const group = req.session.data.user.groups[i];

      mroutes.push({
        routes: this.mergedRoutes[group.type][group.name],
        group: { name: group.name, type: group.type }
      });
    }

    return mroutes;
  }

  async defaultGroup() {
    await this.updateGroupsIfNeeeded();

    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].is_default) {
        return this.groups[i];
      }
    }
  }

  async getGroup(id, type) {
    await this.updateGroupsIfNeeeded();

    for (var i = 0; i < this.groups.length; i++) {
      if (type === undefined) {
        if (this.groups[i].id == id) {
          return this.groups[i];
        } else if (this.groups[i].name == id && this.groups[i].type == 'group') {
          return this.groups[i];
        }
      } else if (this.groups[i].id == id || (this.groups[i].name == id && this.groups[i].type == type)) {
        return this.groups[i];
      }
    }
  }

  async getGroups() {
    await this.updateGroupsIfNeeeded();

    return this.groups;
  }

  async getMappedGroups() {
    await this.updateGroupsIfNeeeded();

    return this.mappedGroups;
  }

  async updateGroupsIfNeeeded() {
    if (this.redis.needsGroupUpdate) {
      await this.updateGroupList();
    }
  }

  groupInheritedMerge(group, groups) {
    var nallowed = group.allowed ? [...group.allowed] : [];

    if (group.inherited && group.inherited.length > 0) {
      if (!group.inheritedGroups) {
        group.addProperty('inheritedGroups', []);
      }
      for (var i = 0; i < group.inherited.length; ++i) {
        for (var j = 0; j < groups.length; ++j) {
          if (groups[j].id == group.inherited[i]) {
            // group.inheritedGroups[i] = new Group({...groups[j]._, inherited: groups[j]._.inherited ? [...groups[j]._.inherited] : []});
            group.inheritedGroups[i] = new Group(groups[j]._);
            break;
          }
        }
        nallowed.push(...this.groupInheritedMerge(group.inheritedGroups[i], groups));
      }
    }
    return nallowed;
  }
}

module.exports = new GroupManager();
