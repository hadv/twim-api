Firstly, run `npm install` to download all the dependencies modules

Then you can run `npm test` to run all the test


==========
Running the REST API on the local machine

1. install and start mongodb
2. run `npm start` to start the REST API server (install npm and nodejs if need)
3. REST API URI
  - All the REST API is authenticate by bearer,
    to call the api you need to pass the token key in the request header or in query param.
    - header: [Authorization: Bearer suMwoiihHZkYuYq]
    ```
      GET /api/v1/user/admin HTTP/1.1
      Host: localhost:3000
      Content-Type: application/json
      Authorization: Bearer suMwoiihHZkYuYq
      Cache-Control: no-cache
      Postman-Token: dd7ec54c-cb97-fb29-59a0-87d9cde68233
    ```
    - query param: /?access_token=suMwoiihHZkYuYq
    ```
    http://localhost:3000/api/v1/category/list/0/?access_token=suMwoiihHZkYuYq
    ```

  - list category: http://localhost:3000/api/v1/category/list/:date
  ```
  [  
   {  
      "_id":"abcxyz",
      "name":"Electronics",
      "description":"Talking about all the electricity devices.",
      "level":"N1",
      "__v":0,
      "updated_at":"2016-01-12T03:56:15.792Z",
      "created_at":"2016-01-12T03:56:15.790Z",
      "disp_order":2,
      "topic_count":5,
      "id":"abcxyz"
    }
   ]
  ```

  - list topic by category: http://localhost:3000/api/v1/topic/list/:id/:date
  ```
  [  
   {  
      "_id":"google",
      "title":"Alpha-Beta is for Google",
      "short_desc":"As Sergey and I wrote in the original founders letter 11 years ago",
      "description":"We did a lot of things that seemed crazy at the time. Many of those crazy things.",
      "category":"abcxyz",
      "__v":0,
      "updated_at":"2016-01-12T03:56:15.807Z",
      "created_at":"2016-01-12T03:56:15.807Z",
      "disp_order":4,
      "id":"google"
    }
   ]
  ```

  - get topic by id: http://localhost:3000/api/v1/topic/id/:id
  ```
  {  
     "_id":"google",
     "title":"Alpha-Beta is for Google",
     "short_desc":"As Sergey and I wrote in the original founders letter 11 years ago",
     "description":"We did a lot of things that seemed crazy at the time. Many of those crazy things.",
     "category":"abcxyz",
     "__v":0,
     "updated_at":"2016-01-12T03:56:15.807Z",
     "created_at":"2016-01-12T03:56:15.807Z",
     "disp_order":4,
     "id":"google"
  }  
  ```

  - get all feedback by userid: http://localhost:3000/api/v1/feedback/userid/hadv/0/?access_token=suMwoiihHZkYuYq
  ```
  [{  
      "_id":"56a5c2570d92fc9e1e826e88",
      "talk":"Electronics",
      "topic":"Talking about all the electricity devices.",
      "rater":"hadv",
      "ratee":"kk",
      "__v":0,
      "updated_at":"2016-01-25T06:36:07.139Z",
      "created_at":"2016-01-25T06:36:07.138Z",
      "feedbacks":[  
         {  
            "title":"grammar",
            "note":"So good! <3",
            "_id":"56a5c2570d92fc9e1e826e8a",
            "point":5,
            "id":"56a5c2570d92fc9e1e826e8a"
         },
         {  
            "title":"pronoucian",
            "note":"Pfffff! (y)",
            "_id":"56a5c2570d92fc9e1e826e89",
            "point":10,
            "id":"56a5c2570d92fc9e1e826e89"
         }
      ],
      "id":"56a5c2570d92fc9e1e826e88"
   },
   {  
      "_id":"56a5c2570d92fc9e1e826e8b",
      "talk":"Laptops",
      "topic":"Talking about all the electricity devices.",
      "rater":"kk",
      "ratee":"hadv",
      "__v":0,
      "updated_at":"2016-01-25T06:36:07.146Z",
      "created_at":"2016-01-25T06:36:07.146Z",
      "feedbacks":[  
         {  
            "title":"grammar",
            "note":"So poor! <3",
            "_id":"56a5c2570d92fc9e1e826e8d",
            "point":1,
            "id":"56a5c2570d92fc9e1e826e8d"
         },
         {  
            "title":"pronoucian",
            "note":"so sad! :(",
            "_id":"56a5c2570d92fc9e1e826e8c",
            "point":2,
            "id":"56a5c2570d92fc9e1e826e8c"
         }
      ],
      "id":"56a5c2570d92fc9e1e826e8b"
   }]
  ```

  - add new feedback: [POST: http://localhost:3000/api/v1/feedback/add]
  input data in the body as below:
  ```
  {
    talk: 'Mobile',
    topic: 'Talking about all the electricity devices.',
    rater: 'hadv',
    ratee: 'kk',
    feedbacks: [
      {
        title: 'grammar',
        point: 5,
        note: 'So good! <3'
      },
      {
        title: 'pronoucian',
        point: 10,
        note: 'Pfffff! (y)'
      }
    ]
  }  
  ```
