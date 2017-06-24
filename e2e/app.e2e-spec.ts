import { Angular4tictactoePage } from './app.po';

describe('angular4tictactoe App', () => {
  let page: Angular4tictactoePage;

  beforeEach(() => {
    page = new Angular4tictactoePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
