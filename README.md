# Kimola Airset Generator
This tiny browser extension helps you to generate datasets to analyze and classify on [Kimola](https://kimola.com/) products.

**Important: You have to set up this extension after you complete onboarding at Kimola Cognitive, since you will need an API key that you can access after finishing the onboarding.**
 
Installation Instructions

Google Chrome

1. Download this repo as a ZIP file from GitHub.
2. Unzip the file and you should have a folder named kimola-airset-generator.
3. In Chrome go to the extensions page (chrome://extensions).
4. Switch to "Developer Mode" on the right-top corner.
5. Drag the kimola-airset-generator folder anywhere on the page to import it (do not delete the folder afterwards).  
6. Go to your Kimola Cognitive dashboard.
7. Choose "Models" from the left menu or go to https://cognitive.kimola.com/models directly.
8. On the left side, you will see the API Key. Copy your API Key and paste to Airset Generator and complete installation.

When you've completed these steps you are ready to use Kimola Airset Generator. 

Kimola Airset Generator currently supports;
- YouTube (Go to a video with comments - e.g., https://www.youtube.com/watch?v=XQbuhm-RReQ)
- Capterra (Go to a product page with reviews - e.g., https://www.capterra.com/p/120550/Asana/reviews/)
- AppSumo (Go to a deal page with reviews (Questions are not scraped) - e.g., https://appsumo.com/products/formaloo/)
- AirBnB (Go to a house / flat with reviews - e.g., https://www.airbnb.com.tr/rooms/21375511/reviews?source_impression_id=p3_1658146803_gKLlsyiRKdxt83QL)
- Reddit (Go to a post with comments - e.g., https://www.reddit.com/r/mildlyinfuriating/comments/w1jxyw/my_friend_group_forgot_today_is_my_birthday_and/)
- Instagram (Go to a post with comments - e.g., https://www.instagram.com/p/CgKiDqdlXba/)
- Google Play (Go to a webpage of an app and select its reviews and wait until the modal which includes reviews open - e.g., https://play.google.com/store/apps/details?id=notion.id&hl=tr&gl=US)
- Amazon.com (Go to a product with reviews, click on "all reviews" - e.g., https://www.amazon.com/Fiodio-Mechanical-Keyboards-Anti-Ghosting-Multi-Media/product-reviews/B09NNF3K2C/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews
- Trustpilot (Go to the page of a business that has reviews) - e.g., https://www.trustpilot.com/review/panaceafinancial.com
- Booking (Go to the page of a hotel thas has reviews and click "Guest Reviews" on the right corner. A white screen on the right will come up, start Generating the Airset and stop when you grab enough reviews.) - e.g., https://www.booking.com/hotel/gb/thealan.en-gb.html?label=operasoft-sdO15-350386&sid=56b64e67c5af533a1009f4b40566b5d9&aid=350386&ucfs=1&arphpl=1&dest_id=-2602512&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&hpos=1&hapos=1&sr_order=popularity&srpvid=16805e76ea170125&srepoch=1659360366&from_sustainable_property_sr=1&from=searchresults#tab-main
- Yelp (Go to the page of a business that has reviews) - e.g. - https://www.yelp.com/biz/buck-wild-brewing-and-taproom-oakland and stop when you grab enough reviews.) - e.g., https://www.yelp.com/biz/buck-wild-brewing-and-taproom-oakland
- G2 (Go to the page of a business that has reviews and click on "all reviews") - e.g.,https://www.g2.com/products/slack/reviews
- Google Business Reviews ((Go to the page of a business that has reviews and click on "all reviews") - e.g.,[https://www.g2.com/products/slack/reviews](https://www.google.com/search?q=Statue+of+Liberty&client=opera&hs=d0Z&sxsrf=ALiCzsbLdKYfUW_64WV-Ftfi4ewxpNWPSw%3A1659362631743&ei=R93nYsL1LMiFxc8PlqKsuAw&ved=0ahUKEwiCtd_B56X5AhXIQvEDHRYRC8cQ4dUDCA0&uact=5&oq=Statue+of+Liberty&gs_lcp=Cgdnd3Mtd2l6EAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyBwgAEEcQsAMyDQguEMcBEK8BELADEEMyDQguEMcBEK8BELADEEMyDQguEMcBEK8BELADEEMyBwgAELADEEMyCggAEOQCELADGAEyCggAEOQCELADGAEyCggAEOQCELADGAEyDwguENQCEMgDELADEEMYAjIMCC4QyAMQsAMQQxgCMg8ILhDUAhDIAxCwAxBDGAJKBAhBGABKBAhGGAFQiwRYiwRggQZoA3ABeACAAQCIAQCSAQCYAQCgAQKgAQHIARLAAQHaAQYIARABGAnaAQYIAhABGAg&sclient=gws-wiz#lrd=0x89c25090129c363d:0x40c6a5770d25022b,1,,,))
- Udemy (Go to the page of a course that has reviews and click on "see more reviews") - e.g.,[https://www.g2.com/products/slack/reviews](https://www.udemy.com/course/learning-python-for-data-analysis-and-visualization/#reviews)
- Influenster (Go to the page of a product and click "Generate") - e.g., https://www.influenster.com/reviews/babyganics-mineral-based-baby-sunscreen-lotion-spf-50
- Tripadvisor (Go to the page of a business and click on "Reviews" - e.g., https://www.tripadvisor.com.tr/Hotel_Review-g951444-d19275524-Reviews-Mare_Deluxe_Residence-Gundogan_Bodrum_District_Mugla_Province_Turkish_Aegean_Coast.html) 
- Finances Online (Go to the page of a business and click on "Reviews") - e.g., https://reviews.financesonline.com/p/wrike/


## Generating Airset
When on a web site supported by Kimola Airset Generator, you will see the badge on the icon. Badge displays the number of comments can be scraped.
![extension-with-a-badge](https://user-images.githubusercontent.com/2235594/179510551-d1f4203e-8106-413f-92af-6b368f0fbb5a.png)

If you can not see a red badge on the icon as expected, reload the page or see "all reviews" page if there is one. 
After clicking on "Generate" button, you will see the counting starts. Click on the "stop" icon when you want to stop generating reviews.
Go to Airsets on Cognitive dashboard to see and analyze your Airset https://cognitive.kimola.com/airsets
