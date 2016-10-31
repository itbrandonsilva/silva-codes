import { SilvaCodesPage } from './app.po';

describe('silva-codes App', function() {
  let page: SilvaCodesPage;

  beforeEach(() => {
    page = new SilvaCodesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
