import React from 'react';
import DietDetail from './DietDetail';
import { diets } from './data/dietData';

export default function HighProteinDiet({ navigation }) {
  return <DietDetail route={{ params: { diet: diets.highProtein } }} />;
}