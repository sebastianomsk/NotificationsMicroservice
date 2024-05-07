'use strict';

const { expect } = require('chai');
const mockRequire = require('mock-require');

const defaultFrom = process.env.TEST_EMAIL_FROM || 'test@test.com';
const defaultTo = process.env.TEST_EMAIL_TO || 'test@test.com';
const defaultName = process.env.TEST_EMAIL_NAME || defaultTo.split('@')[0];

describe('Channels', () => {
    describe('EmailAWS', () => {
        let channel;

        //
        // Configurations
        //

        before(function () {
            // Prevent mocha timeout error.
            this.enableTimeouts(false);
            // Initialize server
            channel = require('../../core/helpers/channels/emailAWS');
        });

        // Stop all mock created
        after(() => {
            mockRequire.stop('../../core/helpers/channels/emailAWS');
        });

        //
        // Tests
        //

        it('should has notificator instance', done => {
            expect(channel).to.not.be.an('undefined');
            done();
        });

        describe('#validate', () => {
            it('should has function property validate on channel instance', done => {
                expect(channel.validate).to.be.a('function');
                done();
            });

            it('should return true when channel validate correct arguments', done => {
                const valid = channel.validate(
                    /* options */ {
                        from: defaultFrom,
                        subject: 'Unit/Acceptant Test notification email channel',
                        to: defaultTo
                    }
                );

                expect(valid).to.be.a('boolean').equal(true);
                done();
            });

            it('should return false when channel validate arguments without "to"', done => {
                const valid = channel.validate(
                    /* options */ {
                        text: `Hola ${defaultName},`,
                        from: defaultFrom,
                        subject: 'Unit/Acceptant Test notification email channel'
                    }
                );

                expect(valid).to.be.a('boolean').equal(false);
                done();
            });

            it('should return false when channel validate arguments without "subject"', done => {
                const valid = channel.validate(
                    /* options */ {
                        text: `Hola ${defaultName},`,
                        from: defaultFrom,
                        to: defaultTo
                    }
                );

                expect(valid).to.be.a('boolean').equal(false);
                done();
            });
        });

        describe('#dispatch', () => {
            it('should has function property dispatch on channel instance', done => {
                expect(channel.dispatch).to.be.a('function');
                done();
            });

            it('should return messageResponse when channel dispatch with correct arguments', function (done) {
                // Prevent mocha timeout error.
                this.enableTimeouts(false);

                // Mock emailAWS module
                const emailAWSMock = {
                    dispatch: async () => ({ messageResponse: 'Mocked response' }) // Mock dispatch function
                };
                // Replace the real module with the mock
                mockRequire('../../core/helpers/channels/emailAWS', emailAWSMock);
                // Initialize server
                const channelMock = require('../../core/helpers/channels/emailAWS');

                channelMock.dispatch(
                    /* options */ {
                        from: defaultFrom,
                        text: `Hola ${defaultName},`,
                        subject: 'Unit/Acceptant Test notification email channel',
                        to: defaultTo
                    }
                )
                    .then(res => {
                        expect(res).to.be.an('object');
                        expect(res).to.have.property('messageResponse').to.be.a('string');
                        done();
                    })
                    .catch(done);
            });
        });
    });
});
