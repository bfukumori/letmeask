import { useHistory, useParams } from 'react-router';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import deleteImg from '../assets/images/delete.svg';
import { database } from '../services/firebase';
import checking from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })
    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length === 1 ? "pergunta" : "perguntas"}</span>}
        </div>
        <div className="question-list">
          {questions.map(({ content, author, id, isAnswered, isHighlighted }) => <Question
            key={id}
            content={content}
            author={author}
            isAnswered={isAnswered}
            isHighlighted={isHighlighted}
          >
            {!isAnswered && (
              <>
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(id)}
                >
                  <img src={checking} alt="Marcar pergunta como respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHighLightQuestion(id)}
                >
                  <img src={answerImg} alt="Dar destaque à pergunta" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => handleDeleteQuestion(id)}
            >
              <img src={deleteImg} alt="Remover pergunta" />
            </button>
          </Question>)}
        </div>
      </main>
    </div>
  )
}