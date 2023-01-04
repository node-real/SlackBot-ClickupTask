const { App, WorkflowStep, LogLevel } = require('@slack/bolt');
const { createTask } = require('./clickup.js')

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // add this
  appToken: process.env.SLACK_APP_TOKEN, // add this
  logLevel: LogLevel.DEBUG,
});


// Create a new WorkflowStep instance
const ws = new WorkflowStep('create_clickup_task', {
  edit: async ({ ack, step, configure }) => {
    await ack();

    const blocks = [
      {
        type: 'input',
        block_id: 'task_name_input',
        element: {
          type: 'plain_text_input',
          action_id: 'name',
          placeholder: {
            type: 'plain_text',
            text: 'Add a task name',
          },
        },
        label: {
          type: 'plain_text',
          text: 'Task name',
        },
      },
      {
        type: 'input',
        block_id: 'task_description_input',
        element: {
          type: 'plain_text_input',
          action_id: 'description',
          multiline: true,
          placeholder: {
            type: 'plain_text',
            text: 'Add a task description',
          },
        },
        label: {
          type: 'plain_text',
          text: 'Task description',
        },
      },
    ];

    await configure({ blocks });
  },
  save: async ({ ack, step, view, update }) => {
    await ack();

    const { values } = view.state;
    const taskName = values.task_name_input.name;
    const taskDescription = values.task_description_input.description;
                
    const inputs = {
      taskName: { value: taskName.value },
      taskDescription: { value: taskDescription.value }
    };

    const outputs = [
      {
        type: 'text',
        name: 'taskName',
        label: 'Task name',
      },
      {
        type: 'text',
        name: 'taskDescription',
        label: 'Task description',
      }
    ];

    await update({ inputs, outputs });
  },
  execute: async ({ step, complete, fail }) => {
    const { inputs } = step;

    const outputs = {
      taskName: inputs.taskName.value,
      taskDescription: inputs.taskDescription.value,
    };

    createTask(outputs.taskName, outputs.taskDescription)

    // signal back to Slack that everything was successful
    await complete({ outputs });
    // NOTE: If you run your app with processBeforeResponse: true option,
    // `await complete()` is not recommended because of the slow response of the API endpoint
    // which could result in not responding to the Slack Events API within the required 3 seconds
    // instead, use:
    // complete({ outputs }).then(() => { console.log('workflow step execution complete registered'); });

    // let Slack know if something went wrong
    // await fail({ error: { message: "Just testing step failure!" } });
    // NOTE: If you run your app with processBeforeResponse: true, use this instead:
    // fail({ error: { message: "Just testing step failure!" } }).then(() => { console.log('workflow step execution failure registered'); });
  },
});

app.step(ws);

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();