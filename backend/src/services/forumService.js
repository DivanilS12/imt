import { db, FieldValue } from '../config/firebase.js';
import { collections } from '../models/collections.js';
import { AppError } from '../middlewares/errorMiddleware.js';

export const listTopics = async () => {
  const snapshot = await db.collection(collections.forumTopics).orderBy('createdAt', 'desc').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getTopicById = async (id) => {
  const doc = await db.collection(collections.forumTopics).doc(id).get();
  if (!doc.exists) throw new AppError('Topico nao encontrado', 404);
  return { id: doc.id, ...doc.data() };
};

export const createTopic = async (user, payload) => {
  const doc = await db.collection(collections.forumTopics).add({
    titulo: payload.titulo,
    conteudo: payload.conteudo,
    autor: { id: user.id, nome: user.nome, foto: user.foto || null },
    respostas: 0,
    curtidas: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return getTopicById(doc.id);
};

export const updateTopic = async (id, userId, payload) => {
  const topic = await getTopicById(id);
  if (topic.autor?.id !== userId) throw new AppError('Sem permissao para editar este topico', 403);

  await db.collection(collections.forumTopics).doc(id).update({
    titulo: payload.titulo,
    conteudo: payload.conteudo,
    updatedAt: FieldValue.serverTimestamp()
  });

  return getTopicById(id);
};

export const deleteTopic = async (id, userId) => {
  const topic = await getTopicById(id);
  if (topic.autor?.id !== userId) throw new AppError('Sem permissao para remover este topico', 403);

  const comments = await db
    .collection(collections.forumComments)
    .where('topicId', '==', id)
    .get();

  const batch = db.batch();
  comments.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(db.collection(collections.forumTopics).doc(id));
  await batch.commit();
};

export const listComments = async (topicId) => {
  await getTopicById(topicId);
  const snapshot = await db
    .collection(collections.forumComments)
    .where('topicId', '==', topicId)
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createComment = async (topicId, user, payload) => {
  await getTopicById(topicId);
  const doc = await db.collection(collections.forumComments).add({
    topicId,
    conteudo: payload.conteudo,
    autor: { id: user.id, nome: user.nome, foto: user.foto || null },
    curtidas: 0,
    createdAt: FieldValue.serverTimestamp()
  });

  await db.collection(collections.forumTopics).doc(topicId).update({
    respostas: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp()
  });

  const saved = await doc.get();
  return { id: saved.id, ...saved.data() };
};

export const deleteComment = async (commentId, userId) => {
  const ref = db.collection(collections.forumComments).doc(commentId);
  const doc = await ref.get();
  if (!doc.exists) throw new AppError('Comentario nao encontrado', 404);

  const comment = doc.data();
  if (comment.autor?.id !== userId) throw new AppError('Sem permissao para remover este comentario', 403);

  await ref.delete();
  await db.collection(collections.forumTopics).doc(comment.topicId).update({
    respostas: FieldValue.increment(-1),
    updatedAt: FieldValue.serverTimestamp()
  });
};
