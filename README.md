# SUPER-BICA

This is the README.md file for the extended Bird Cage Shop project. See original (https://github.com/kisphapha/SWP-BIRD-CAGE). With the help of masters, I made this version that improved the website quite significantly and fixed many bugs that remained on the previous version. I spent the whole my December on it and I may call it Bica 2.0
## Technology Stack
- Frontend: ReactJs
- Backend: ExpressJs
- Database: SQL Server

## Features

What is different from the original?

1. Custom Cages: Rework completely, customer now has more choices of customizing their cages instead of restrained on available components. They can customize every component of the cage from the hook to the bottom, they can even make their own pattern and send us images. Processing flow has also been improved, the customers and the cage makers can have messages back and forth through forms so that they get a mutual understanding and give the expected results
2. Notification System: Added, and Rework the notification system. Users can now track their orders, feedback responses, and more through a small bell button in the header. Admin/Staff can also get notified about customer actions and then try to meet their needs. The web flow is now significantly easier to grasp.
3. Cancel and Return Orders: Users now have a much better experience with these new features. They can now cancel the order as long as they are not in the "Shipping" status. They can also return the order and get a refund if something goes wrong with the products once the order is delivered. The shop can either approve or rejects
4. Voucher reworked: Added the maximum price can decrease to prevent the huge amount of money taken away from the order when the order's total amount is high.
5. Security: The old version did not have security at all. Now, the web is more secure with access tokens to call API, Session memory manipulating is no longer a thread, Hide all important information on .env files. 
6. Bug fixed: Multiple feedbacks in the same order item, Edit address is not working, Unfinished transaction but "Paid", etc.
7. Future plans (unlikely to become reality) :
   - Custom Cage Forum where everyone can share their custom cage and get comments, and upvotes.
   - Feedback and refund Custom Cages
   - Better dashboard for admin
   - Employees management
   - Promotion popups (based on events and created by the shop owner)
   - ...

## Getting Started

To run the Bird Cage Shop project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/kisphapha/SUPER-BICA.git`

2. Install dependencies:
   - Navigate to the frontend directory: `cd ./frontend`
   - Run `npm install` to install frontend dependencies. (you can use npm install --force for the stubborn dependencies (caused by version conflicts))
   
   - Navigate to the backend directory: `cd ./backend`
   - Run `npm install` to install backend dependencies. (you can use npm install --force for the stubborn dependencies (caused by version conflicts))

3. Database Setup:
   - Set up an SQL Server database. Database backup files can be found in the dbscript folder. We'll give you available data so you don't have to insert them one by one. For a tutorial on how to open a .bacpac file, see database-creation-guide.txt in the same folder

4. Setup environment:
-   In the backend folder, add a ".env" file with the following content:<br>
         DB_USER = <Your-user-name><br>
         DB_PASSWORD = <Your-password><br>
         DB_SERVER = <Your-server's-name><br>
         DB_PORT = 1433<br>
         DB_NAME = bica10<br>
         PORT=3000<br>
         SERVER_KEY = (Your random string, make sure that server key in the frontend and backend folder are the same)<br>
-    In the frontend folder, add a ".env" file with the following content:<br>
         VITE_SERVER_KEY = (Your random string, make sure that server key in frontend and backend folder are the same<br>
          VITE_GOOGLE_API = <Your-google-API-key><br>
          VITE_IMAGE_API = <Your-Imgbb-API-key><Br>
5. Start the Application:
   - Start the frontend: In the frontend directory, run `npm run dev`.
   - Start the backend: In the backend directory, run `npm start`.

6. Access the application in your browser at `http://localhost:5000`.
