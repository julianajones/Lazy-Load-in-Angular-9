import {Component, ComponentFactoryResolver, Injector, OnInit, OnDestroy, SimpleChange, ViewChild, ViewContainerRef} from '@angular/core';
import {QuizService} from './quiz.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('quizContainer', {read: ViewContainerRef}) quizContainer: ViewContainerRef;
  @ViewChild('testContainer', {read: ViewContainerRef}) testContainer: ViewContainerRef;
  quizStarted = false;
  private destroy$ = new Subject();

  constructor(private quizservice: QuizService, private cfr: ComponentFactoryResolver, private injector: Injector) {
  }

  ngOnInit(): void {
    this.loadTest();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadTest() {
    await this.lazyLoadTestCard();
  }
  
  async startQuiz() {
    await this.lazyLoadQuizCard();
    this.quizStarted = true;
  }

  async showNewQuestion() {
    this.lazyLoadQuizCard();
  }

  private async lazyLoadTestCard() {
    // Import Component
    const {TestCardComponent} = await import('./test-card/test-card.component');
    
    // Get Component Factory
    const testCardFactory = this.cfr.resolveComponentFactory(TestCardComponent);
    
    // Place Component into container
    const {instance} = this.testContainer.createComponent(testCardFactory, null, this.injector);   
  }

  private async lazyLoadQuizCard() {
    const {QuizCardComponent} = await import('./quiz-card/quiz-card.component');
    const quizCardFactory = this.cfr.resolveComponentFactory(QuizCardComponent);
    const {instance} = this.quizContainer.createComponent(quizCardFactory, null, this.injector);
    instance.question = this.quizservice.getNextQuestion();
    instance.questionAnswered.pipe(
      takeUntil(instance.destroy$)
    ).subscribe(() => this.showNewQuestion());
    (instance as any).ngOnChanges({
      question: new SimpleChange(null, instance.question, true)
    });
  }
}