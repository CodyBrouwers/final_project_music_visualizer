require_relative "spec_helper"

describe "the test page" do
  
  it "has the text Home Page" do
    visit "/"
    expect(page).to have_content('Home Page')
    page.check('checkme')
    expect(page).to have_content('goodbye')
  end

  it "has a check box that can be checked" do
    visit "/"
    page.check('checkme')
    expect(page).to have_selector("input[value='yes']")

  end

end