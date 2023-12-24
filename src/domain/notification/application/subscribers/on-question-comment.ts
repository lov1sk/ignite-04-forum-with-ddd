import { EventHandler } from "@/core/events/event-handler";
import { DomainEvents } from "@/core/events/domain-events";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CommentOnQuestionEvent } from "@/domain/forum/enterprise/events/comment-on-question";

export class OnQuestionComment implements EventHandler {
  constructor(
    private sendNotificationUseCase: SendNotificationUseCase,
    private questionsRepository: QuestionsRepository
  ) {
    this.setupSubscriptions();
  }
  public setupSubscriptions() {
    // Estou registrando uma ouvidoria para os eventos disparados por
    DomainEvents.register(
      this.sendQuestionCommentedNotification.bind(this),
      CommentOnQuestionEvent.name
    );
  }

  private async sendQuestionCommentedNotification({
    questionComment,
  }: CommentOnQuestionEvent) {
    const questionCommented = await this.questionsRepository.findById(
      questionComment.questionId.toString()
    );

    if (questionCommented) {
      await this.sendNotificationUseCase.execute({
        title: "Novo comentario em sua pergunta",
        content: `Sua pergunta ${questionCommented.title
          .substring(0, 15)
          .concat("...")} recebeu um novo comentario`,
        recipientId: questionCommented.authorId.toString(),
      });
    }
  }
}
