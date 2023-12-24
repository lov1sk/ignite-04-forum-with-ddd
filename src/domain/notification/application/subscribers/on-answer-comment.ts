import { EventHandler } from "@/core/events/event-handler";
import { DomainEvents } from "@/core/events/domain-events";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { CommentOnAnswerEvent } from "@/domain/forum/enterprise/events/comment-on-answer";

export class OnAnswerComment implements EventHandler {
  constructor(
    private sendNotificationUseCase: SendNotificationUseCase,
    private answersRepository: AnswersRepository
  ) {
    this.setupSubscriptions();
  }
  public setupSubscriptions() {
    // Estou registrando uma ouvidoria para os eventos disparados por
    DomainEvents.register(
      this.sendAnswerCommentedNotification.bind(this),
      CommentOnAnswerEvent.name
    );
  }

  private async sendAnswerCommentedNotification({
    answerComment,
  }: CommentOnAnswerEvent) {
    const answerCommented = await this.answersRepository.findById(
      answerComment.answerId.toString()
    );

    if (answerCommented) {
      await this.sendNotificationUseCase.execute({
        title: "Novo comentario em sua resposta",
        content: `Sua resposta ${answerCommented.content
          .substring(0, 15)
          .concat("...")} recebeu um novo comentario`,
        recipientId: answerCommented.authorId.toString(),
      });
    }
  }
}
