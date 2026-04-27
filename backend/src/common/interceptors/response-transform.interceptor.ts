import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}

@Injectable()
export class ResponseTransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // Preserve file/binary responses (CSV/PDF downloads)
                if (
                    data instanceof StreamableFile ||
                    Buffer.isBuffer(data) ||
                    (data && typeof data === 'object' && typeof (data as any).pipe === 'function')
                ) {
                    return data as any;
                }

                // If data already has success property, return as-is
                if (data && typeof data === 'object' && 'success' in data) {
                    return data;
                }

                return {
                    success: true,
                    data,
                    message: 'Success',
                };
            }),
        );
    }
}
