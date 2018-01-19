
const querystring = require('querystring');

module.exports = class TalentCircles {
  constructor(domain, app_id, api_key, prefix='https://', api_path='/api/v1/', environment='pro') {
    this.domain = domain;
    this.app_id = app_id;
    this.api_key = api_key;
    this.prefix = prefix;
    this.api_path = api_path,
    this.url = this.prefix + this.domain + this.api_path;
    this.environment = environment;
    this.auth_params = {
      'user': app_id,
      'pass': api_key,
      'sendImmediately': false
    };

    if (environment === 'dev') {
      this.request = require('request-promise-native').defaults({
        'strictSSL': false, // allow us to use our self-signed cert for testing
        'rejectUnauthorized': false
      });
    } else {
      this.request = require('request-promise-native');
    }
  }

  getPosessions(resource, resource_id, posession, additional_params = null) {
    this.validateId(resource, resource_id);
    let uri = this.url + resource + "/" + resource_id.toString() + "/" + posession;
    if (additional_params) {
      uri = uri + "?" + querystring.stringify(additional_params);
    }
    return this.request.get(uri, {'auth': this.auth_params})
    .then(resource_json => JSON.parse(resource_json));
  }

  getResource(resource, resource_id) {
    this.validateId(resource, resource_id);
    let idString = '';
    if (Number.isInteger(resource_id)) {
      idString = resource_id.toString();
    } else if (Array.isArray(resource_id)) {
      idString = resource_id.join();
    }
    let uri = this.url + resource + "/" + idString;
    return this.request.get(uri, {'auth': this.auth_params})
    .then(resource_json => JSON.parse(resource_json));
  }

  createResource(resource, resource_data, default_fields = null) {
    let uri = this.url + resource;
    if (default_fields) {
      Object.assign(resource_data, default_fields);
    }
    return this.request.post(uri, {'auth': this.auth_params})
    .form(resource_data)
    .then(resource_json => JSON.parse(resource_json));
  }

  createPosession(resource, resource_id, posession, posession_data, default_fields=null) {
    let uri = this.url + resource + "/" + resource_id + "/" + posession
    if (default_fields) {
      Object.assign(posession_data, default_fields);
    }
    return this.request.post(uri, {'auth': this.auth_params})
    .form(posession_data)
    .then(resource_json => JSON.parse(resource_json));
  }

  searchResource(resource, search_params, page=1, results_per_page=10) {
    let request_params = {
      'page':page,
      'results_per_page':results_per_page
    }

    if (typeof(search_params) != 'undefined') {
      Object.assign(request_params, search_params);
    }

    let uri = this.url + resource + "?" + querystring.stringify(request_params);

    return this.request.get(uri, {'auth': this.auth_params})
      .then(resource_json => JSON.parse(resource_json));
  }

  updateResource(resource, resource_id, resource_data) {
    this.validateId(resource, resource_id);
    let idString = '';
    if (Number.isInteger(resource_id)) {
      idString = resource_id.toString();
    } else if (Array.isArray(resource_id)) {
      idString = resource_id.join();
    }
    let uri = this.url + resource + "/" + idString;
    return this.request.put(uri, {
      'auth': {
        'user': this.app_id,
        'pass': this.api_key,
        'sendImmediately': false
      }
    })
    .form(resource_data)
    .then(resource_json => JSON.parse(resource_json));
  }

  validateResourceData(resource_data, required_fields) {
    let fields_submitted = Object.keys(resource_data);
    // console.log("fields submitted: ", fields_submitted);
    // console.log("required fields: ", required_fields);
    required_fields.forEach(field => {
      // console.log("field", field);
      if (fields_submitted.indexOf(field) < 0) {
        throw new Error("Required field not found: " + field);
      }
    });
    return resource_data;
  }

  // JOBS //
  getJob(job_id) {
    return this.getResource('jobs', job_id)
      .then(result => result.job);
  }

  getJobCandidates(job_id) {
    return this.getPosessions('jobs', job_id, 'candidates')
      .then(result => result.candidates)
  }

  getJobList(job_ids) {
    return this.getResource('jobs', job_ids)
      .then(result => result.jobs);
  }

  getSimilarJobs(job_id) {
    return this.getPosessions('jobs', job_id, 'similar_jobs')
      .then(result => result.jobs);
  }

  createJob(job_data) {
    let current_date = this.defaultDateString();
    const default_details = {
      'available_on':current_date,
      'commitment_level':'Full-Time',
      'apply_behavior':'url redirect',
      'urlRedirect':'https://talentcircles.com'
    }
    return this.createResource('jobs', job_data)
      .then(result => result.job);
  }

  searchJobs(search_params, page=1, results_per_page=10) {
    return this.searchResource('jobs', search_params, page, results_per_page)
      .then(result => result.jobs);
  }

  updateJob(job_id, job_data) {
    return this.updateResource('jobs', job_id, job_data)
      .then(result => result.job);
  }

  // ADD JOB VALIDATION FUNCTION!!!!


  // USERS //
  getUser(user_id) {
    return this.getResource('users', user_id)
      .then(result => result.user);
  }

  getUserList(user_ids) {
    return this.getResource('users', user_ids)
      .then(result => result.users);
  }

  getUserMatchingJobs(user_id) {
    return this.getPosessions('users', user_id, 'matching_jobs')
      .then(result => result.jobs);
  }

  getUserStories(user_id) {
    return this.getPosessions('users', user_id, 'stories')
      .then(result => result.stories);
  }

  getSimilarUsers(user_id) {
    return this.getPosessions('users', user_id, 'similar_candidates')
      .then(result => result.users);
  }

  createUser(new_user_data) {
    let valid_data = this.validateUserData(new_user_data)
    return this.createResource('users', valid_data)
      .then(result => result.user);
  }

  searchUsers(search_params, page=1, results_per_page=10) {
    return this.searchResource('users', search_params, page, results_per_page)
      .then(result => result.users);
  }

  updateUser(user_id, update_data) {
    return this.updateResource('users', user_id, update_data)
      .then(result => result.user);
  }

  validateUserData(user_data) {
    const required_fields = [
      'firstname',
      'lastname',
      'email'
    ];

    let validated = this.validateResourceData(user_data, required_fields);
    let fields = Object.keys(validated);
    if (fields.indexOf('zipcode') < 0 && (fields.indexOf('city') < 0 && fields.indexOf('state') < 0)) {
      throw new Error('Missing location data for new user. Please include either a zipcode, or a city and state.');
    }
    return validated;
  }

  // CIRCLES //
  createCircle(circle_data) {
    let valid_data = this.validateCircleData(circle_data)
    return this.createResource('circles', valid_data)
      .then(result => result.circle);
  }

  getCircle(circle_id) {
    return this.getResource('circles', circle_id)
      .then(result => result.circle);
  }

  getCircleList(circle_ids) {
    return this.getResource('circles', circle_ids)
      .then(result => result.circles);
  }

  getCircleJobs(circle_id, additional_params = null) {
    return this.getPosessions('circles', circle_id, 'jobs', additional_params)
      .then(result => result.jobs);
  }

  getCircleMembers(circle_id) {
    return this.getPosessions('circles', circle_id, 'users')
      .then(result => result.users);
  }

  getCircleStories(circle_id) {
    return this.getPosessions('circles', circle_id, 'stories')
      .then(result => result.stories);
  }

  postCircleStory(circle_id, story_data) {
    let valid_data = this.validateStoryData(story_data);
    return this.createPosession('circles', circle_id, 'stories', valid_data)
      .then(result => result.story);
  }

  updateCircle(circle_id, circle_data) {
    return this.updateResource('circles', circle_id, circle_data)
      .then(result => result.circle);
  }

  validateCircleData(circle_data) {
    const required_circle_fields = ['circle_name'];
    return this.validateResourceData(circle_data, required_circle_fields);
  }


  // STORIES //
  getStory(story_id) {
    return this.getResource('stories', story_id)
      .then(result => result.story);
  }

  getStoryList(story_ids) {
    return this.getResource('stories', story_ids)
      .then(result => result.stories);
  }

  postStory(story_data) {
    let valid_data = this.validateStoryData(story_data);
    if (Object.keys(valid_data).indexOf('circle_id') < 0) {
      throw new Error('circle_id not specified in story_data');
    }
    return this.createResource('stories', valid_data)
      .then(result => result.story);
  }

  updateStory(story_id, story_update_data) {
    return this.updateResource('stories', story_id, story_update_data)
      .then(result => result.story);
  }

  updateMultipleStories(story_ids, story_update_data) {
    return this.updateResource('stories', story_ids, story_update_data)
      .then(result => result.stories);
  }

  validateStoryData(story_data) {
    const required_fields = [
      'title',
      'story'
    ];
    return this.validateResourceData(story_data, required_fields);
  }

  // Util Functions //
  defaultDateString() {
    const month_names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let today = new Date();
    return month_names[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
  }

  validateId(resource, resource_id) {
    let singular = this.getSingular(resource);
    if (typeof(resource_id) == 'undefined') {
      throw new Error('Missing ' + singular + '_id');
    } else {
      if (isNaN(resource_id)) {
        if(!Array.isArray(resource_id)) {
          throw new Error('Invalid ' + singular + '_id');
        } else {
          if(!resource_id.every(element => Number.isInteger(element))) {
            throw new Error('One or more ' + singular + '_id value is invalid');
          }
        }
      } else {
        if (resource_id < 0) {
          throw new Error('Invalid ' + singular + '_id');
        }      
      }
    }

    return true;
  }

  getSingular(resource_plural) {
    const resources = {
      'circles':'circle',
      'stories':'story',
      'jobs':'job',
      'users':'user'
    }
    return resources[resource_plural]
  }
}

//////////////////////////////////////////////
////////////// Usage Examples ////////////////
//////////////////////////////////////////////

////// Create the object //////
// const tc = new TalentCircles('mytalentmall.talentcircles.vm', 'romeo-5931c22e4190b', 'Y1IgDgriOjAo5hKMzZ0RxC', 'https://', '/api/v1/', 'dev');

//////// JOB FUNCTIONS ////////

///// Get a Single Job //////
// tc.getJob(9489193)
//   .then(job => console.log(job));

//// Get Multiple Jobs ////
// const jobIds = [9489193, 8698596]
// tc.getJobList(jobIds)
//   .then(jobs => console.log(jobs));

//// Get Job Candidates ////
// tc.getJobCandidates(7480159)
//   .then(candidates => console.log(candidates));

//// Get Similar Jobs ////
// tc.getSimilarJobs(8832807)
//   .then(jobs => console.log(jobs));

///// Create Job /////
// let new_job_data = {
//   'job_title': 'Senior Mycologist',
//   'available_on': 'January 16, 2018',
//   'category_id': 30,
//   'commitment_level': 'Full-Time',
//   'zipcode': 78726,
//   'description': 'We need someone who knows about fungi.',
//   'apply_behavior': 'url redirect',
//   'urlRedirect': 'https://talentcircles.com'
// };

// tc.createJob(new_job_data)
//   .then(new_job => console.log(new_job));

//// Search Jobs ////
// let search_params = {"commitment_levels":1};
// tc.searchJobs(search_params)
//   .then(jobs => console.log(jobs));

///// Update Job /////
// let job_id = 8698591;
// let update_data = {
//   'job_title': 'Most Excellent Accounting Expert'
// };

// tc.updateJob(job_id, update_data)
//   .then(updated_job => console.log(updated_job));

//////// USER FUNCTIONS ////////

///// Get a Single User //////
// let user_id = 12770147;
// tc.getUser(user_id)
//   .then(user => console.log(user));

///// Get Multiple Users /////
// let user_ids = [12770147, 12766961];
// tc.getUserList(user_ids)
//   .then(users => console.log(users));

//// Get Matching Jobs for User ////
// tc.getUserMatchingJobs(12770147)
//   .then(jobs => console.log(jobs));

//// Get Stories Posted by a User ////
// tc.getUserStories(10961800)
//   .then(stories => console.log(stories));

///// Get Similar Users /////
// tc.getSimilarUsers(12770147)
//   .then(users => console.log(users));

///// Create a New User /////
// let user_data = {
//   'firstname':'Steven',
//   'lastname':'Jones',
//   'email':'sjones@wallacecorp.com',
//   'password':'secretpass',
//   'zipcode':93306
// }

// tc.createUser(user_data)
//   .then(user => console.log(user));

///// Search Users /////
// let user_search_params = {"commitment_levels":1};

// tc.searchUsers(user_search_params)
//   .then(users => console.log(users));

///// Update a User /////
// let updating_user_id = 12770498;
// let user_changes = {'email': 'niander@wallace.com'}

// tc.updateUser(updating_user_id, user_changes)
//   .then(user => console.log(user));


//////// CIRCLE FUNCTIONS ////////

///// Get a Circle /////
// tc.getCircle(376)
//   .then(circle => console.log(circle));

///// Get Multiple Circles /////
// const circle_ids = [384, 376];

// tc.getCircleList(circle_ids)
//   .then(circles => console.log(circles));

///// Create New Circle /////
// const new_circle_data = {
//   'circle_name': 'Great Circle to Test the SDK'
// };

// tc.createCircle(new_circle_data)
//   .then(circle => console.log(circle));

///// Get Jobs Posted to a Circle /////
// tc.getCircleJobs(375)
//   .then(jobs => console.log(jobs));

///// Get Members of a Circle /////
// tc.getCircleMembers(375)
//   .then(users => console.log(users));

///// Get Stories Posted to a Circle /////
// tc.getCircleStories(375)
//   .then(stories => console.log(stories));

///// Post a New Story to a Circle /////
// const circle_story_data = {
//   'title':'Great New Story',
//   'story':'This story is both new and great.'
// };

// tc.postCircleStory(375, circle_story_data)
//   .then(story => console.log(story));

///// Update an Existing Circle /////
// const circle_update_data = {
//   'circle_name':'Amazing Simple Circle'
// }

// tc.updateCircle(375, circle_update_data)
//   .then(circle => console.log(circle));

//////// STORY FUNCTIONS ////////

///// Get a Story /////
// tc.getStory(270)
// .then(story => console.log(story));

///// Get Multiple Stories /////
// const story_ids = [270,255];

// tc.getStoryList(story_ids)
//   .then(stories => console.log(stories));

///// Post a Story /////
// const new_story_data = {
//   'circle_id':376,
//   'title':'New Story that is Great',
//   'story':'This story is both new and great.'
// };

// tc.postStory(new_story_data)
//   .then(story => console.log(story));

///// Update a Story /////
// const story_update_data = {
//   'title':'Not So Bad a Story',
//   'story':'You could really do worse'
// }

// tc.updateStory(272, story_update_data)
//   .then(story => console.log(story));

///// Update Multiple Stories /////
// const story_update_data = {
//   'title':'Freshly Updated Story',
//   'story':"It's pretty good."
// }

// const story_ids = [272,271];

// tc.updateMultipleStories(story_ids, story_update_data)
//   .then(story => console.log(story));
