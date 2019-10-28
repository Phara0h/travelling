'use strict';

const Group = require('../database/models/group');
const redis = require('../redis');
const config = require('../utils/config');

class GroupManager {
    constructor() {

        if (!!GroupManager.instance) {
            return GroupManager.instance;
        }

        this.groups = [];
        this.unmergedGroups = [];
        this.mappedGroups = {};
        this.redis = redis;
        this.log = typeof config.log.logger === 'string' ? require(config.log.logger) : config.log.logger;

        GroupManager.instance = this;
        return this;
    }

    async updateGroupList() {
        this.log.debug('Updating Groups');
        var grps = await Group.findAll();

        this.mappedGroups = {};
        this.unmergedGroups = [];
        for (var i = 0; i < grps.length; i++) {
            this.unmergedGroups.push(grps[i]);
            // this.mappedGroups[grps[i].id] = {...grps[i]._, inherited: grps[i]._.inherited ? [...grps[i]._.inherited] : []};
            this.mappedGroups[grps[i].id] = new Group(grps[i]._);
            // this.groups[grps[i].name] = this.groupInheritedMerge(new Group({...grps[i]._, inherited: grps[i]._.inherited ? [...grps[i]._.inherited] : []}), grps);
            this.groups[grps[i].name] = this.groupInheritedMerge(new Group(grps[i]._), grps);
        }
        // console.log(this.groups);
        // console.log(this.mappedGroups);
        this.redis.needsGroupUpdate = false;
    }

    async currentGroup(req, res) {

        await this.updateGroupsIfNeeeded();

        return !req.isAuthenticated ? this.groups['anonymous'] : this.groups[req.session.data.user.group.name];
    }

    async defaultGroup() {

        await this.updateGroupsIfNeeeded();

        for (var i = 0; i < this.unmergedGroups.length; i++) {
            if (this.unmergedGroups[i].is_default) {
                return this.unmergedGroups[i];
            }
        }
    }

    async getGroup(id, type) {

        await this.updateGroupsIfNeeeded();

        for (var i = 0; i < this.unmergedGroups.length; i++) {
            if (type === undefined) {
                if (this.unmergedGroups[i].id == id) {
                    return this.unmergedGroups[i];
                } else if (this.unmergedGroups[i].name == id && this.unmergedGroups[i].type == 'group') {
                    return this.unmergedGroups[i];
                }
            } else if (this.unmergedGroups[i].id == id || this.unmergedGroups[i].name == id && this.unmergedGroups[i].type == type) {
                return this.unmergedGroups[i];
            }
        }
    }

    async getGroups() {

        await this.updateGroupsIfNeeeded();

        return this.unmergedGroups;
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
