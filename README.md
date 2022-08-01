# Kimola Airset Generator
This tiny browser extension helps you to generate datasets to analyze and classify on [Kimola](https://kimola.com/) products.

**Important: You have to set up this extension after you complete onboarding at Kimola Cognitive, since you will need an API key that you can access after finishing the onboarding.**
 
Installation Instructions

Google Chrome

1. Download this repo as a ZIP file from GitHub.
2. Unzip the file and you should have a folder named kimola-airset-generator.
3. In Chrome go to the extensions page (chrome://extensions).
4. Switch to "Developer Mode" on the right-top corner.
5. Drag the kimola-airset-generator folder anywhere on your desktop to import it (do not delete the folder afterwards).  
6. Click "Load Unpacked" and find folder and upload it. 
7. Click on the "Details" and then "Extension Options" and it will need an API key.
8. To find the API key, go to your Kimola Cognitive dashboard.
9. Choose "Models" from the left menu or go to https://cognitive.kimola.com/models directly.
10. On the right side, you will see the API Key. Copy your API Key and paste it to the window that is opened on Chrome  and complete installation.
11. Bookmark your extension to your browser and find reviews on supported mediums.

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
- Trustpilot (Go to the page of a business that has reviews - e.g., https://www.trustpilot.com/review/panaceafinancial.com

## Generating Airset
When on a web site supported by Kimola Airset Generator, you will see the red badge on the icon. Badge displays the number of comments that will be scraped.
![extension-with-a-badge](https://user-images.githubusercontent.com/2235594/179510551-d1f4203e-8106-413f-92af-6b368f0fbb5a.png)

If you can not see a red badge on the icon as expected, reload the page or see "all reviews" page if there is one. 
After clicking on "Generate" button, you will see the counting starts. Click on the "stop" icon when you want to stop generating reviews.
Go to Airsets on Cognitive dashboard to see and analyze your Airset https://cognitive.kimola.com/airsets
