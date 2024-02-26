const Group = require('../database/models/group');
const redis = require('../redis');
const config = require('../utils/config');
const helpers = require('../server/tracing/helpers')();

class GroupManager {
  constructor() {
    if (!!GroupManager.instance) {
      return GroupManager.instance;
    }

    this.mergedRoutes = [];
    this.allPossibleRoutes = {};
    this.groups = [];
    this.mappedGroups = {};
    this.redis = redis;

    // if (typeof config.log.logger === 'string') {
    //   if (config.log.logger === 'wog') {
    //     var a = { ...config.log };

    //     a.logger = console;
    //     config.log.logger = require(config.log.logger)(a);
    //   } else {
    //     //console.log(config.log.logger);
    //     // config.log.logger = require(config.log.logger);
    //   }
    // }
    this.log = config.log.logger;

    GroupManager.instance = this;
    return this;
  }

  async updateGroupList(oldspan) {
    var span;

    if (oldspan) {
      span = helpers.startSpan('updateGroupList', oldspan);
    }

    this.log.debug(helpers.text('Updating Groups', span));
    var grps = await Group.findAll();

    this.mappedGroups = {};
    this.groups = [];
    this.allPossibleRoutes = {};
    var allPossibleRoutesTemp = {};

    for (var i = 0; i < grps.length; i++) {
      this.groups.push(grps[i]);
      this.mappedGroups[grps[i].id] = new Group(grps[i]._);

      if (!this.mergedRoutes[grps[i].type]) {
        this.mergedRoutes[grps[i].type] = {};
      }

      this.mergedRoutes[grps[i].type][grps[i].name] = this.groupInheritedMerge(new Group(grps[i]._), grps, span);

      for (var j = 0; j < this.mergedRoutes[grps[i].type][grps[i].name].length; j++) {
        allPossibleRoutesTemp[this.mergedRoutes[grps[i].type][grps[i].name][j].route] =
          this.mergedRoutes[grps[i].type][grps[i].name][j];
      }
    }

    const allPossibleRoutesTempKeys = Object.keys(allPossibleRoutesTemp);
    for (let i = 0; i < allPossibleRoutesTempKeys.length; i++) {
      var t = allPossibleRoutesTempKeys[i].split('/');

      t.shift();
      var last = this.allPossibleRoutes;

      for (let j = 0; j < t.length; j++) {
        if (t[j] != '') {
          if (!last[t[j]]) {
            last[t[j]] = {};
          }

          last[t[j]].name = allPossibleRoutesTempKeys[i];
          last[t[j]].redirect = allPossibleRoutesTemp[allPossibleRoutesTempKeys[i]].redirect;

          last = last[t[j]];
        }
      }
    }

    this.redis.needsGroupUpdate = false;
    if (span) {
      span.end();
    }
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

    this.log.error('No default group set. Setting default to anonymous');

    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].name == 'anonymous' && this.groups[i].type == 'group') {
        this.groups[i].is_default = true;
        await this.groups[i].save();
        this.redis.needsGroupUpdate = true;
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

  async updateGroupsIfNeeeded(oldspan) {
    if (this.redis.needsGroupUpdate) {
      await this.updateGroupList(oldspan);
    }
  }

  groupInheritedMerge(group, groups, oldspan) {
    var span;

    if (oldspan) {
      span = helpers.startSpan('groupInheritedMerge', oldspan);
    }

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

        nallowed.push(...this.groupInheritedMerge(group.inheritedGroups[i], groups, span));
      }
    }

    if (span) {
      span.end();
    }

    return nallowed;
  }
}

module.exports = new GroupManager();
