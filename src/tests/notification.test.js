import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import db from '../models';
import {
    createNotificationService,
    getNotificationByIdService,
    getAllNotificationsService,
    updateNotificationService,
    deleteNotificationService,
} from '../services';
import {describe} from "mocha/lib/cli/run";

const {expect} = chai;
chai.use(chaiHttp);
chai.use(sinonChai);

describe('Notification Service', () => {
    let notificationMock;

    beforeEach(() => {
        notificationMock = sinon.stub();
        sinon.stub(db.Notification, 'create');
        sinon.stub(db.Notification, 'findOne');
        sinon.stub(db.Notification, 'findAndCountAll');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createNotificationService', () => {
        it('should create a notification successfully', async () => {
            const data = {type: 'info', description: 'New Notification'};
            db.Notification.create.resolves(data);

            const result = await createNotificationService(data);

            expect(result).to.deep.equal({
                err: 0,
                message: 'Notification created successfully',
            });
            expect(db.Notification.create).to.have.been.calledOnceWith(data);
        });

        it('should return an error if notification creation fails', async () => {
            db.Notification.create.resolves(null);

            const result = await createNotificationService({
                type: 'Booking Error',
                description: 'Error Notification',
            });

            expect(result).to.deep.equal({
                err: 1,
                message: 'Error while creating notification',
            });
        });

        it('should return an error if notification type is invalid', async () => {
            db.Notification.create.resolves(null);

            const result = await createNotificationService({
                type: 'Invalid Type',
                description: 'Invalid Notification',
            });

            expect(result).to.deep.equal({
                err: 1,
                message: 'Error while creating notification',
            });
        });
    });

    describe('getNotificationByIdService', () => {
        it('should return a notification if found', async () => {
            const id = '123';
            const notification = {notification_id: id, type: 'info', description: 'Sample Notification'};
            db.Notification.findOne.resolves(notification);

            const result = await getNotificationByIdService(id);

            expect(result).to.deep.equal({
                err: 0,
                message: 'Notification found',
                data: notification,
            });
        });

        it('should return an error if notification not found', async () => {
            db.Notification.findOne.resolves(null);

            const result = await getNotificationByIdService('non-existent-id');

            expect(result).to.deep.equal({
                err: 1,
                message: 'Notification not found',
            });
        });

        it('should return an error if fetching notification fails', async () => {
            db.Notification.findOne.resolves(null);

            const result = await getNotificationByIdService('non-existent-id');

            expect(result).to.deep.equal({
                err: 1,
                message: 'Notification not found',
            });
        });

        it('should return a notification if found', async () => {
            const id = '123';
            const notification = {notification_id: id, type: 'info', description: 'Sample Notification'};
            db.Notification.findOne.resolves(notification);

            const result = await getNotificationByIdService(id);

            expect(result).to.deep.equal({
                err: 0,
                message: 'Notification found',
                data: notification,
            });
        });
    });

    describe('getAllNotificationsService', () => {
        it('should return notifications', async () => {
            const notifications = {
                count: 2,
                rows: [
                    {notification_id: '1', type: 'info', description: 'Notification 1'},
                    {notification_id: '2', type: 'warning', description: 'Notification 2'},
                ],
            };
            db.Notification.findAndCountAll.resolves(notifications);

            const result = await getAllNotificationsService({page: 1, limit: 10});

            expect(result).to.deep.equal({
                err: 0,
                message: 'Notifications found',
                data: notifications,
            });
        });

        it('should return an error if fetching notifications fails', async () => {
            db.Notification.findAndCountAll.resolves(null);

            const result = await getAllNotificationsService({});

            expect(result).to.deep.equal({
                err: 1,
                message: 'Error while fetching notifications',
            });
        });
    });

    describe('updateNotificationService', () => {
        it('should update a notification successfully', async () => {
            const id = '123';
            const data = {type: 'updated', description: 'Updated Notification'};
            const notification = {
                notification_id: id,
                update: sinon.stub().resolves(data),
            };
            db.Notification.findOne.resolves(notification);

            const result = await updateNotificationService(id, data);

            expect(result).to.deep.equal({
                err: 0,
                message: 'Notification updated successfully',
            });
            expect(notification.update).to.have.been.calledOnceWith(data);
        });

        it('should return an error if notification not found', async () => {
            db.Notification.findOne.resolves(null);

            const result = await updateNotificationService('non-existent-id', {});

            expect(result).to.deep.equal({
                err: 1,
                message: 'Notification not found',
            });
        });
    });

    describe('deleteNotificationService', () => {
        it('should delete a notification successfully', async () => {
            const id = '123';
            const notification = {
                notification_id: id,
                destroy: sinon.stub().resolves(),
            };
            db.Notification.findOne.resolves(notification);

            const result = await deleteNotificationService(id);

            expect(result).to.deep.equal({
                err: 0,
                message: 'Notification deleted successfully',
            });
            expect(notification.destroy).to.have.been.calledOnce;
        });

        it('should return an error if notification not found', async () => {
            db.Notification.findOne.resolves(null);

            const result = await deleteNotificationService('non-existent-id');

            expect(result).to.deep.equal({
                err: 1,
                message: 'Notification not found',
            });
        });
    });
});
