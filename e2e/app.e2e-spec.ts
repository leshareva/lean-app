import { LeanAppPage } from './app.po';

describe('lean-app App', function() {
  let page: LeanAppPage;

  beforeEach(() => {
    page = new LeanAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
