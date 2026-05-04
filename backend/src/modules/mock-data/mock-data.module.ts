import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MockDataSeederService } from './mock-data-seeder.service';
import { DevController } from './dev.controller';

// Only register the DevController when seeding is explicitly allowed
// and we are not running in production. This prevents accidental
// exposure of seeding endpoints in environments where they shouldn't run.
const devControllers = (process.env.NODE_ENV !== 'production' && process.env.ALLOW_SEED === 'true')
    ? [DevController]
    : [];

@Module({
    imports: [PrismaModule],
    controllers: devControllers,
    providers: [MockDataSeederService],
    exports: [MockDataSeederService],
})
export class MockDataModule { }
