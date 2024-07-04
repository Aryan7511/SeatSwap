import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@sswaptickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
