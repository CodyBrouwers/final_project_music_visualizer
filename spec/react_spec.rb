require_relative 'spec_helper'

def page!
  save_and_open_page
end

describe 'AppView' do 

  describe 'ListView' do 
    it 'loads with the list view initially ' do 
      expect(page).to have_text("List View")
    end

    it 'displays at least one visualization item ' do 
      expect(page).to have_selector("div.viz", :minimum => 3)
    end

    it 'has a new visual button' do
      expect(page).to have_selector("button", :text => 'New Visual')
    end

  end

end