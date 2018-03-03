#  Popular Music Insights

![Concert](readmeimg/concert.png)

Analysis and visualization of songs, genres, lyrics, artists, demographics, race and gender. 

**Project Title:** 

Popular Music Insights

**Project Outline:**

I. A geographical examination of the musical preferences across 15 cities -- filtered by artist genre, race, and gender -- based on Spotify streaming frequency. 
* Example of the interactive map that examines the musical preferences for particular cities
![Map](readmeimg/Map.png)

II. Emotional influences and lyrical content mapped by analysis of 70 years of top-charting Billboard songs by genre. 
* Example of the carousel that displays the word clouds for top hits 
**John your image goes here**
* Example of the emotional attributes of hit songs over the last 70 years: 
![bubble_plot](readmeimg/bubble.png)

**Technology used:**

* Spotify API
* Watson Personality Insights API
* Beautiful Soup
* Lyrics Wiki 
* wordcloud Library
* Pandas
* Numpy
* Pandas
* HTML, CSS, JS
* MongoDB

# File descriptions

#### emotion_analysis

* country
  * billboard_country.csv
  	* top country hits and lyrics
  * country_bub_form.csv
  	* Output from country_bubble.ipynb
  * country_bubble.ipynb
  	* Converts country_combined.csv into format for bubble plot. 
  * country_combined.csv
  	* Output from country_exploration.ipynb
  * country_exploration.ipynb
  	* Takes country_lyr_results and combines together into one source in country_exploration.ipynb and stored as output in country_combined.csv
  * country_to_watson.ipynb
  	* Watson Personality Insights API call and analysis. Converts billboard_country.csv into country_lyr_results.
  * country_lyr_results
  	* Output from Watson API

* Pop
  * billboard_pop.csv
  	* top pop hits and lyrics
  * pop_bub_form.csv
  	* Output from pop_bubble.ipynb
  * pop_bubble.ipynb
  	* Converts pop_combined.csv into format for bubble plot. 
  * pop_combined.csv
  	* Output from pop_exploration.ipynb
  * pop_exploration.ipynb
  	* Takes pop_lyr_results and combines together into one source in pop_exploration.ipynb and stored as output in pop_combined.csv
  * country_to_watson.ipynb
  	* Watson Personality Insights API call and analysis. Converts billboard_pop.csv into pop_lyr_results.
  * pop_lyr_results
  	* Output from Watson API

* RnB
  * billboard_rnb.csv
  	* top rnb hits and lyrics
  * rnb_bub_form.csv
  	* Output from rnb_bubble.ipynb
  * rnb_bubble.ipynb
  	* Converts rnb_combined.csv into format for bubble plot. 
  * rnb_combined.csv
  	* Output from rnb_exploration.ipynb
  * rnb_exploration.ipynb
  	* Takes rnb_lyr_results and combines together into one source in rnb_exploration.ipynb and stored as output in rnb_combined.csv
  * country_to_watson.ipynb
  	* Watson Personality Insights API call and analysis. Converts billboard_rnb.csv into rnb_lyr_results.
  * rnb_lyr_results
  	* Output from Watson API
   
#### frontend
* Left over branch for front end developement

### proposal_img
* Inspirational images for the project

### readmeimg 
* Images used for this readme

#### spotify_data
* Artist, genre, song, gender, race, and city demographic data for the interactive map. 

#### vis_integration
* Integration of all parts for final presesntation and app.py for flask deployment 

#### visualizations
* Test folder for frontend changes



