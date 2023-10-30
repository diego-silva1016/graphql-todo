import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type User {
    id: Int
    name: String
  }

  type Task {
    id: Int
    description: String
    dateCreated: String
    dateFinished: String
    done: Boolean
  }

  type Query {
    getUsers: [User]
    getTasks: [Task]
    getTaskById(id: Int): Task
    getPendingTasks: [Task]
    getDoneTasks: [Task]
  }

  type Mutation {
    createTask(description: String): Task
    finishTask(taskId: Int): Task,
    editTask(taskId: Int, description: String): Task
    deleteTask(taskId: Int) : String
  }
`;

let newId = 3;

const users = [
    {
      id: 1,
      name: 'Diego'
    }
  ];

const tasks = [
    {
      id: 1,
      description: 'Ir ao mercado',
      dateCreated: "10/02/2023",
      dateFinished: "10/02/2023",
      done: false,
    },
    {
        id: 2,
        description: 'Ir ao médico',
        dateCreated: "26/10/2023",
        dateFinished: null,
        done: false,
      },
  ];

const resolvers = {
    Query: {
      getUsers: () => users,
      getTasks: () => tasks,
      getTaskById: (_, { id }) => tasks.find(t => t.id === id),
      getPendingTasks: () => tasks.filter(t => !t.done),
      getDoneTasks: () => tasks.filter(t => t.done)
    },
    Mutation: {
        createTask(_, { description }) {
            const newTask = {
                id: newId,
                description,
                dateCreated: new Date().toLocaleDateString('pt-BR'),
                dateFinished: null,
                done: false
            }
        
          tasks.push(newTask)
          newId++   
    
          return newTask
        },
        finishTask(_, { taskId }) {
            const taskToEdit = tasks.find(t => t.id === taskId)
            
            if(!taskToEdit)
                throw new Error("Tarefa não encontrada")

            taskToEdit.done = true
            taskToEdit.dateFinished = new Date().toLocaleDateString("pt-BR")
    
          return taskToEdit
        },
        editTask(_, { taskId, description }) {
            const taskToEdit = tasks.find(t => t.id === taskId)
            
            if(!taskToEdit)
                throw new Error("Tarefa não encontrada")

            taskToEdit.description = description
    
          return taskToEdit
        },
        deleteTask(_, { taskId }) {
            const taskIndex = tasks.findIndex(t => t.id === taskId)

            tasks.splice(taskIndex, 1)

            return "Tarefa deletada"
        }
    }
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);