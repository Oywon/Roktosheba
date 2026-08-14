import 'dotenv/config';
import { expireStaleDonors } from './expirations';

expireStaleDonors()
  .then((result) => {
    console.log(`Expired ${result.count} stale donors.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
