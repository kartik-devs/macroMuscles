import React from 'react';
import DietDetail from './DietDetail';
import { diets } from './data/dietData';

export default function VeganDiet({ navigation }) {
  return <DietDetail route={{ params: { diet: diets.vegan } }} />;
}