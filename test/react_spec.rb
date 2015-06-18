require_relative 'spec_helper'

describe 'react' do 

  it 'loads with the list view initially ' do 
    visit "/"
    expect(page).to have_text("Raf")
    # expect(page).to have_content('List View')
  end


end