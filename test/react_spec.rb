require_relative 'spec_helper'

describe 'react' do 

  it 'loads with the list view initially ' do 
    visit "/"
    expect(page).to have_text("List View")
  end


end