const { Clickup } = require('clickup.js');

const clickupToken = process.env.CLICKUP_TOKEN; // API access token
const clickup = new Clickup(clickupToken);

const createTask = async (taskNmae, taskDescription, listId=205795695) => {
    try {
     // create a task on a list
     const taskData = {
      name: taskNmae,  
      description: taskDescription,
      tags: ['Support'],
      status: 'To Do',
      notify_all: true,
      parent: null,
      links_to: null,
     };
   
     const { body } = await clickup.lists.createTask(listId, taskData);
     console.log(body);
    } catch (error) {
     if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.body);
      console.log(error.response.statusCode);
      console.log(error.response.headers);
     } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
     } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
     }
     console.log(error.options);
    }
   };

exports.createTask = createTask