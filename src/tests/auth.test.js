import {expect} from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import db from '../models';
import * as hashPassword from '../utils/hashPassword';
import * as authServices from '../services/auth.service';

describe('Login Service', () => {
    let findOneStub, comparePasswordStub, jwtSignStub; // Declare the stubs
    // Giả lập các hàm cần thiết trước khi chạy test case

    beforeEach(() => {
        // Giả lập hàm findOne của model User
        findOneStub = sinon.stub(db.User, 'findOne');

        // Giả lập hàm comparePassword của hashPassword
        comparePasswordStub = sinon.stub(hashPassword, 'comparePassword');
        // hashPassword là một object chứa các hàm, nên ta cần giả lập hàm
        // comparePassword bằng cách truy cập vào thuộc tính comparePassword của object hashPassword

        // Giả lập hàm sign của jwt
        jwtSignStub = sinon.stub(jwt, 'sign');
    });

    afterEach(() => {
        // Xóa các giả lập sau khi chạy xong test case
        findOneStub.restore();
        comparePasswordStub.restore();
        jwtSignStub.restore();
    });

    it('should return error when user is not found', async () => {
        // Giả lập hàm findOne trả về null | trong trường hợp này thì user không tồn tại
        findOneStub.resolves(null);

        // Gọi hàm loginService với tham số email và password bất kỳ
        const result = await authServices.loginService({
            email: 'admin@gmail.com',
            password: 'admin'
        });

        // Kiểm tra kết quả trả về
        expect(result.err).to.equal(1);
        expect(result.message).to.equal('Invalid email or password');
        expect(result.accessToken).to.equal('Bearer null'); // Check for 'Bearer null'
    });

    it('should return error when password is invalid', async () => {

        findOneStub.resolves({email: 'lehoangtrong1@gmail.com', password: 'hashedPassword'});
        comparePasswordStub.returns(false);

        const result = await authServices.loginService({email: 'lehoangtrong1@gmail.com', password: 'admin'});

        expect(result.err).to.equal(1);
        expect(result.message).to.equal('Invalid email or password');
        expect(result.accessToken).to.equal('Bearer null');
    });

    it('should return access token when login successfully', async () => {
        findOneStub.resolves({email: 'lehoangtrong1@gmail.con', password: 'hashedPassword'});
        comparePasswordStub.returns(true);
        jwtSignStub.returns('access-token');

        const result = await authServices.loginService({
            email: 'lehoangtrong1@gmail.com',
            password: 'lehoangtrong'
        });

        expect(result.err).to.equal(0);
        expect(result.message).to.equal('Login successful');
        expect(result.accessToken).to.equal('Bearer access-token');
    });
});
