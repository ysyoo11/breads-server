import * as threadsRepository from '../data/threads.js';

export async function getThreads(req, res) {
  const username = req.query.username;
  const data = await (username
    ? threadsRepository.getAllByUsername(username)
    : threadsRepository.getAll());
  const simplified = data.map(simplifyThread);
  res.status(200).json(simplified);
}

export async function getThreadById(req, res) {
  const id = req.params.id;
  const thread = await threadsRepository.getById(id);
  thread
    ? res.status(200).json(thread)
    : res.status(404).json({ message: `Thread not found` });
}

export async function createThread(req, res) {
  const thread = await threadsRepository.create(req.body.text, req.userId);
  const simplified = simplifyThread(thread);
  res.status(201).json(simplified);
}

export async function updateThread(req, res) {
  const id = req.params.id;
  const text = req.body.text;
  const thread = await threadsRepository.getById(id);
  if (!thread) {
    return res.status(404).json({ message: 'Thread not found' });
  }
  if (thread.userId !== req.userId) {
    return res.status(403).json({ message: 'Forbidden request' });
  }
  const updatedThread = await threadsRepository.update(id, text);
  const simplified = simplifyThread(updatedThread);
  res.status(200).json(simplified);
}

export async function removeThread(req, res) {
  const id = req.params.id;
  const thread = await threadsRepository.getById(id);
  if (!thread) {
    return res.status(404).json({ message: 'Thread not found' });
  }
  if (thread.userId !== req.userId) {
    return res.status(403).json({ message: 'Forbidden request' });
  }
  await threadsRepository.remove(id);
  res.status(200).json({ message: 'Thread deleted' });
}

function simplifyThread(thread) {
  const { id, username, imgUrl, createdAt, updatedAt, text } =
    thread.dataValues;
  return { id, username, imgUrl, createdAt, updatedAt, text };
}
