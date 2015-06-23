require_relative 'spec_helper'

describe 'AppView' do 

  it 'loads with the list view initially ' do 
    visit "/"
    expect(page).to have_text("List View")
  end

describe 'ListView' do 

  it 'will display at least one visualization item' do 
    visit "/"
    expect(page).to have_selector('img')
    sleep(10)
  end
end




end