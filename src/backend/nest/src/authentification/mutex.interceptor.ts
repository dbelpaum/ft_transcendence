// mutex.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { Mutex } from 'async-mutex';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class MutexInterceptor implements NestInterceptor {
  private mutex = new Mutex(); 

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const release = await this.mutex.acquire();

    return next.handle().pipe(
      tap({
        next: async () => {
          await new Promise(resolve => setTimeout(resolve, 1200)); // Attendre 1.1 secondes
          release();
        },
        complete: () => release(), // Libérer le verrou à la fin de la requête
      }),
      catchError((err) => {
        console.error('Erreur interceptée:', err);
        release(); // Assurez-vous de libérer le verrou même en cas d'erreur
        return throwError(err); // Renvoyez l'erreur pour qu'elle puisse être traitée ailleurs
      })
    );
  }
}
