/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {Application} from 'spectron';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';

const electronPath = path.join(__dirname, '..', 'node_modules', 'electron', 'index.js');
// const appPath = path.join(__dirname, '..', 'src', 'electron', 'main.ts');
const appPath = path.join(__dirname, '..', 'dist','main.js');

global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
});

const app = new Application({
            path: electronPath,
            chromeDriverArgs: [
              "start-maximized",
              "disable-infobars",
              "--remote-debugging-port=9515",
              "--headless",
              "--disable-gpu",
              "--no-sandbox",
              "--verbose",
              "--window-size=800x600",
              /*"--allow-insecure-localhost",
              "--disable-extensions",
              "--test-type",
              "--whitelisted-ips=",
              "--ignore-certificate-errors",
              "--disable-popup blocking",
              "--disable-translate",
              "--disable-logging",
              "--disable-plugins",*/
              "--disable-dev-shm-usage"
            ],
            args: [appPath],
            chromeDriverLogPath: path.join(__dirname, '..', 'chromeDriver.log'),
            webdriverLogPath: path.join(__dirname, '..', 'webdriver.log')
        });

describe('Test Example', function () {
  this.timeout(10000)
  beforeEach(function (done) {
      void app.start()
        .then(() => {
          done();
        })
        .catch((error: unknown) => {
          console.error('Error BeforeEach:',error);
          done(error);
        });
  });

  afterEach(function (done) {
    void app.stop()
      .then(() => {
        done();
      })
      .catch((error: unknown) => {
        console.error('Error AfterEach:', error);
        done(error);
      });
  });

  it('opens a window', function (done) {
    void app.client.waitUntilWindowLoaded()
    .then(() => {
      void app.client.getWindowCount().should.eventually.equal(1);
      done();
    })
    .catch((error: unknown) => {
      console.error('Error Test;', error);
      done(error);
    });
  });

  /*it('tests the title', function () {
    return app.client.waitUntilWindowLoaded()
      .getTitle().should.eventually.equal('Hello World!');
  });*/
});