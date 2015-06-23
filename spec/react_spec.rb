require_relative 'spec_helper'

describe 'AppView' do 

  describe 'ListView' do 
    # it 'loads with the list view initially ' do 
    #   expect(page).to have_text("List View")
    # end

    # it 'displays at least one visualization item ' do 
    #   expect(page).to have_selector("div.viz", :minimum => 3)
    # end

    # it 'has a new visual button' do
    #   expect(page).to have_selector("button", :text => 'New Visual')
    # end

    it 'has new visual button that takes you to the edit page' do
      click_button('New Visual')
      page.save_screenshot('spec/tmp/new_visual_button_click.png')
      expect(page).to have_selector("div.viz-container")

    end

  end

end