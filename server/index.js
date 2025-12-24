import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'collab_code';
const COLLECTION = 'documents';

let db, collection;
let documentId = 'default';

MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION);
    return collection.updateOne(
      { _id: documentId },
      { $set: { content: '' } },
      { upsert: true }
    );
  })
  .catch(console.error);

app.get('/', (req, res) => res.send('OK'));

// Optional health route that checks DB connectivity if available
app.get('/healthz', async (req, res) => {
  try {
    if (!db) {
      return res.status(200).send('OK (DB not ready)');
    }
    await db.command({ ping: 1 });
    res.status(200).send('OK');
  } catch (e) {
    console.error('Health check failed:', e);
    res.status(500).send('DB unreachable');
  }
});

io.on('connection', (socket) => {
  io.emit('user-count', io.engine.clientsCount);
  console.log('A user connected:', socket.id);
  if (!collection) {
    console.warn('Mongo collection not ready; sending empty init');
    socket.emit('init', '');
  } else {
    collection
      .findOne({ _id: documentId })
      .then((doc) => {
        console.log('Sending init to', socket.id, doc ? doc.content : '');
        socket.emit('init', doc ? doc.content : '');
      })
      .catch((err) => {
        console.error('Error fetching initial document:', err);
        socket.emit('init', '');
      });
  }

  socket.on('code-change', (newContent) => {
    console.log('Received code-change from', socket.id);
    if (collection) {
      collection
        .updateOne({ _id: documentId }, { $set: { content: newContent } })
        .catch((err) => console.error('Error updating document:', err));
    }
    socket.broadcast.emit('code-change', newContent);
  });

  socket.on('disconnect', () => {
    setTimeout(() => {
      io.emit('user-count', io.engine.clientsCount);
      console.log('User disconnected:', socket.id);
    }, 100);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
