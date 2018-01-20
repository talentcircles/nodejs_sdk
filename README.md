# TalentCircles NodeJS Developer Kit

This library allows NodeJS developers to integrate a TalentCircles network into their own
application through HTTP calls to that network's REST API endpoints.

<!-- ## Setup -->
Setup is simple and easy with npm. Once you are certain you have at least node 6.0.0
installed, use the following command from your project root:
```
$ npm install talentcircles --save
```

## Usage
First import TalentCircles from talentcircles.talentcircles
```javascript
const TalentCircles = require('talentcircles');
```
Then initialize the SDK object:
```javascript
// Use your Network URL, App ID, and Api Key to connect to your API.
// It is reccomended that this information be kept somewhere in your
// project that is not accessible from the public html directory.
const app_id = "romeo-5931c22e4190b";
const api_key = "Y1IgDgriOjAo5hKMzZ0RxC";
const domain = "mytalentmall.talentcircles.vm";

// Initialize the object
const tc = new TalentCircles(domain, app_id, api_key)
```
Then call any of the functions below to access data on the TalentCircles
network you are using. Each function will return a Promise that resolves 
to a resource object (or array of objects) when the API call is completed.
For example, to get a Job object, call `getJob()` with a job id:
```javascript
let job_id = 9489193
tc.getJob(job_id)
	.then((job) => {
		// Do something with the returned Job object...
		console.log(job);
	});
```

## Functions
### Job Functions
**getJob(INT job_id)** - Get a single Job object for the job posting
identified by job_id
```javascript
let job_id = 7480159;

tc.getJob(9489193)
  .then(job => console.log(job));
```

**getJobList(ARR job_ids)** - Get multiple Job objects for the job postings
identified by an array of job_ids
```javascript
const jobIds = [9489193, 8698596];

tc.getJobList(jobIds)
  .then(jobs => console.log(jobs));
```

**getJobCandidates(INT job_id)** - Get an array of matching user objects of
possible candidates for the job posting identified by job_id
```javascript
let job_id = 7480159;

tc.getJobCandidates(job_id)
  .then(candidates => console.log(candidates));
```

**getSimilarJobs(INT job_id)** - Get an array of job objects with job
postings similar to the job posting identified by job_id
```javascript
let job_id = 8832807;

tc.getSimilarJobs(job_id)
  .then(jobs => console.log(jobs));
```

**createJob(OBJ new_job_data)** - Post a new Job ad, returns the new
Job object
```javascript
const new_job_data = {
  'job_title': 'Senior Mycologist',
  'available_on': 'January 16, 2018',
  'category_id': 30,
  'commitment_level': 'Full-Time',
  'zipcode': 78726,
  'description': 'We need someone who knows about fungi.',
  'apply_behavior': 'url redirect',
  'urlRedirect': 'https://talentcircles.com'
};

tc.createJob(new_job_data)
  .then(new_job => console.log(new_job));
```

**searchJobs(OBJ search_params, INT page, INT results_per_page)** - Get a
list of Job objects from the database, using SPHINX search
```javascript
let search_params = {
    "commitment_levels":1
};
let page = 1;
let results_per_page = 10;

tc.searchJobs(search_params)
  .then(jobs => console.log(jobs));
```

**updateJob(INT job_id, OBJ update_data)** - Update an existing job posting
identified by job_id, returns an updated Job object
```javascript
let job_id = 8698591;
const update_data = {
  'job_title': 'Most Excellent Accounting Expert'
};

tc.updateJob(job_id, update_data)
  .then(updated_job => console.log(updated_job));
```

### User Functions
**getUser(INT user_id)** - Get a single User object for the user profile
identified by user_id
```javascript
let user_id = 12770147;

tc.getUser(user_id)
  .then(user => console.log(user));
```

**getUserList(ARR user_ids)** - Get an array of User objects for the profiles
identified by an array of user_ids
```javascript
let user_ids = [12770147, 12766961];

tc.getUserList(user_ids)
  .then(users => console.log(users));
```

**getUserMatchingJobs(INT user_id)** - Get an array of Jobs that may
be suitable for the user profile identified by user_id
```javascript
let user_id = 12770260;

tc.getUserMatchingJobs(user_id)
  .then(jobs => console.log(jobs));
```

**getUserStories(INT user_id)** - Get an array of Stories posted by the user
identified by user_id
```javascript
let user_id = 10961800;

tc.getUserStories(user_id)
  .then(stories => console.log(stories));
```

**getSimilarUsers(INT user_id)** - Get an array of User profiles that have similar
qualifications and experience to the user identified by user_id
identified by user_id
```javascript
let user_id = 12770147;

tc.getSimilarUsers(user_id)
  .then(users => console.log(users));
```

**createUser(OBJ user_data)** - Create a new User profile, returns the new
User object
```javascript
const user_data = {
  'firstname':'Steven',
  'lastname':'Jones',
  'email':'sjones@wallacecorp.com',
  'password':'secretpass',
  'zipcode':93306
};

tc.createUser(user_data)
  .then(user => console.log(user));
```

**searchUsers(OBJ search_params, INT page, INT results_per_page)** - Get a
list of Users from the database using SPHINX search
```javascript
const user_search_params = {
    "commitment_levels":1
};
let page = 1;
let results_per_page = 10;

tc.searchUsers(user_search_params, page, results_per_page)
  .then(users => console.log(users));
```

**updateUser(INT user_id, OBJ update_data)** - Update an existing User
profile identified by user_id, returns an updated User object
```javascript
let updating_user_id = 12770498;
const user_changes = {'email': 'niander@wallace.com'}

tc.updateUser(updating_user_id, user_changes)
  .then(user => console.log(user));
```

### Circle Functions
**getCircle(INT circle_id)** - Get a single Circle object for the circle
identified by circle_id
```javascript
let circle_id = 375;

tc.getCircle(circle_id)
  .then(circle => console.log(circle));
```

**getCircleList(ARR circle_ids)** - Get an array of Circle objects for circles
identified by an array of circle_ids
```javascript
let circle_ids = [384, 376];

tc.getCircleList(circle_ids)
  .then(circles => console.log(circles));
```

**getCircleJobs(INT circle_id, INT offset, INT limit)** - Get an array of Job
objects posted to the circle identified by circle_id
```javascript
let circle_id = 375;

tc.getCircleJobs(circle_id)
  .then(jobs => console.log(jobs));
```

**getCircleMembers(INT circle_id)** - Get an array of User objects for members
of the circle identified by circle_id
```javascript
let circle_id = 375;

tc.getCircleMembers(circle_id)
  .then(users => console.log(users));
```

**createCircle(OBJ circle_data)** - Create a new Circle, returns a Circle
object
```javascript
const new_circle_data = {
  'circle_name': 'Great Circle to Test the SDK'
};

tc.createCircle(new_circle_data)
  .then(circle => console.log(circle));
```

**postCircleStory(INT circle_id, OBJ story_data)** - Post a new Story to
the Circle identified by circle_id, returns a Circle object
```javascript
let circle_id = 375;
const circle_story_data = {
  'title':'Great New Story',
  'story':'This story is both new and great.'
};

tc.postCircleStory(circle_id, circle_story_data)
  .then(story => console.log(story));
```

**updateCircle(INT circle_id, OBJ update_data)** - Update an existing Circle
identified by circle_id, returns a updated Circle object
```javascript
let circle_id = 375;
const circle_update_data = {
  'circle_name':'Amazing Simple Circle'
}

tc.updateCircle(circle_id, circle_update_data)
  .then(circle => console.log(circle));
```

### Story Functions
**getStory(INT story_id)** - Get a single Story object for the story post
identified by story_id
```javascript
let story_id = 196;

tc.getStory(story_id)
.then(story => console.log(story));
```

**getStoryList(ARR story_ids)** - Get multiple Story objects for story posts
identified by an array of story_ids
```javascript
let story_ids = [270,255];

tc.getStoryList(story_ids)
  .then(stories => console.log(stories));
```

**postStory(OBJ story_data)** - Post a new story to a Circle, returns the
Story object
```javascript
const new_story_data = {
  'circle_id':376,
  'title':'New Story that is Great',
  'story':'This story is both new and great.'
};

tc.postStory(new_story_data)
  .then(story => console.log(story));
```

**updateStory(INT story_id, OBJ story_data)** - Update an existing Story
identified by story_id, returns the updated Story object
```javascript
let story_id = 272;
const story_update_data = {
  'title':'Not So Bad a Story',
  'story':'You could really do worse'
}

tc.updateStory(story_id, story_update_data)
  .then(story => console.log(story));
```

**updateMultipleStories(ARR story_ids, OBJ story_data)** - Update a set of existing
Stories identified by an array of story_ids, returns an array of the updated
Story objects
```javascript
const story_update_data = {
  'title':'Freshly Updated Story',
  'story':"It's pretty good."
}

let story_ids = [272,271];

tc.updateMultipleStories(story_ids, story_update_data)
  .then(story => console.log(story));
```
