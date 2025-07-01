import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

async function setTrafficZero() {
  await sequelize.sync();
  await linkModel.update({ traffic: 0 }, { where: { traffic: null } });
  console.log('Traffic set to 0 for all existing links.');
  process.exit(0);
}

setTrafficZero();

// npx ts-node src/scripts/set-traffic-zero.ts