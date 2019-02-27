const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'George',
            room: 'Secret Room'
        }, {
            id: '2',
            name: 'Jen',
            room: 'Open Room'
        }, {
            id: '3',
            name: 'Mike',
            room: 'Secret Room'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Yannis',
            room: 'The office fans'
        };
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        var userId = '99';
        var user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        var userId = '2';
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        var userId = 99;
        var user = users.getUser(userId);

        expect(user).toBeFalsy();
    });

    it('should return names for Secret Room', () => {
        var userList = users.getUserList('Secret Room');

        expect(userList).toEqual(['George', 'Mike']);
    });

    it('should return names for Open Room', () => {
        var userList = users.getUserList('Open Room');

        expect(userList).toEqual(['Jen']);
    });
});