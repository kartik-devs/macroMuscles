// Diet data for all diet plans

export const diets = {
  keto: {
    name: 'Keto Diet',
    description: 'High-fat, moderate-protein, and very-low-carb diet.',
    features: ['Weight Loss', 'Healthy'],
    icon: 'flame',
    color: '#E53935',
    meals: {
      Breakfast: [
        'Scrambled eggs with spinach',
        'Avocado smoothie',
      ],
      Lunch: [
        'Grilled chicken salad with olive oil',
        'Zucchini noodles with pesto',
      ],
      Dinner: [
        'Salmon with asparagus',
        'Cauliflower rice stir-fry',
      ],
      Snacks: [
        'Nuts and seeds',
        'Cheese sticks',
      ],
    },
  },
  
  intermittentFasting: {
    name: 'Intermittent Fasting',
    description: 'Eat in an 8-hour window, fast for 16.',
    features: ['16:8 fasting', 'Flexible meals'],
    icon: 'time-outline',
    color: '#0097e6',
    meals: {
      Breakfast: ['Black coffee', 'Boiled eggs (in eating window)'],
      Lunch: ['Chicken wrap', 'Greek salad'],
      Dinner: ['Grilled fish', 'Steamed broccoli'],
      Snacks: ['Yogurt', 'Fruit (in eating window)'],
    },
  },
  
  highProtein: {
    name: 'High Protein Diet',
    description: 'Boost muscle with extra protein and calories.',
    features: ['2000-2500 kcal', 'High protein', 'Moderate carbs'],
    icon: 'barbell-outline',
    color: '#44bd32',
    meals: {
      Breakfast: ['Omelette with cheese', 'Protein shake'],
      Lunch: ['Turkey sandwich', 'Quinoa bowl'],
      Dinner: ['Steak with sweet potato', 'Brown rice and beans'],
      Snacks: ['Cottage cheese', 'Protein bar'],
    },
  },
  
  mediterranean: {
    name: 'Mediterranean Diet',
    description: 'Based on traditional foods of Mediterranean countries.',
    features: ['Heart-healthy', 'Anti-inflammatory'],
    icon: 'leaf-outline',
    color: '#27ae60',
    meals: {
      Breakfast: ['Greek yogurt with honey and nuts', 'Whole grain toast with olive oil'],
      Lunch: ['Mediterranean salad with feta', 'Lentil soup with vegetables'],
      Dinner: ['Grilled fish with herbs', 'Roasted vegetables with olive oil'],
      Snacks: ['Hummus with vegetables', 'Fresh fruit and nuts'],
    },
  },
  
  paleo: {
    name: 'Paleo Diet',
    description: 'Eat like a hunter-gatherer: meat, fish, veggies, fruits, nuts.',
    features: ['No processed foods', 'Grain-free'],
    icon: 'nutrition-outline',
    color: '#e67e22',
    meals: {
      Breakfast: ['Egg and vegetable scramble', 'Berry smoothie with almond milk'],
      Lunch: ['Grilled chicken with avocado', 'Sweet potato and vegetable hash'],
      Dinner: ['Grass-fed steak with roasted vegetables', 'Baked salmon with asparagus'],
      Snacks: ['Apple with almond butter', 'Beef jerky'],
    },
  },
  
  vegan: {
    name: 'Vegan Diet',
    description: 'Plant-based: no animal products.',
    features: ['Plant-based', 'Environmentally friendly'],
    icon: 'leaf',
    color: '#16a085',
    meals: {
      Breakfast: ['Overnight oats with plant milk and berries', 'Tofu scramble with vegetables'],
      Lunch: ['Chickpea salad sandwich', 'Lentil and vegetable soup'],
      Dinner: ['Bean and vegetable stir-fry', 'Quinoa bowl with roasted vegetables'],
      Snacks: ['Hummus with carrot sticks', 'Trail mix with dried fruits and nuts'],
    },
  },
  
  vegetarian: {
    name: 'Vegetarian Diet',
    description: 'No meat or fish, but may include dairy and eggs.',
    features: ['Plant-focused', 'Includes dairy and eggs'],
    icon: 'egg-outline',
    color: '#f39c12',
    meals: {
      Breakfast: ['Vegetable omelette', 'Yogurt parfait with granola'],
      Lunch: ['Caprese sandwich', 'Vegetable and bean soup'],
      Dinner: ['Eggplant parmesan', 'Vegetable curry with rice'],
      Snacks: ['Cheese and crackers', 'Greek yogurt with honey'],
    },
  },
  
  atkins: {
    name: 'Atkins Diet',
    description: 'Low-carb diet with a focus on protein and fat, then slowly add back some carbs.',
    features: ['Low-carb', 'High-protein'],
    icon: 'barbell-outline',
    color: '#8e44ad',
    meals: {
      Breakfast: ['Bacon and eggs', 'Low-carb protein shake'],
      Lunch: ['Chicken Caesar salad (no croutons)', 'Bunless burger with cheese'],
      Dinner: ['Steak with buttered vegetables', 'Salmon with asparagus'],
      Snacks: ['String cheese', 'Hard-boiled eggs'],
    },
  },
  
  dukan: {
    name: 'Dukan Diet',
    description: 'High-protein, low-carb diet in phases.',
    features: ['High-protein', 'Phased approach'],
    icon: 'fitness-outline',
    color: '#2980b9',
    meals: {
      Breakfast: ['Fat-free yogurt with oat bran', 'Egg whites with lean ham'],
      Lunch: ['Grilled chicken breast', 'Fat-free cottage cheese'],
      Dinner: ['Lean fish with herbs', 'Turkey breast'],
      Snacks: ['Fat-free sugar-free yogurt', 'Lean protein'],
    },
  },
};

// Default template for custom diet
export const customDietTemplate = {
  name: 'Custom Diet',
  description: 'Your personalized diet plan.',
  features: ['Customizable', 'Personalized'],
  icon: 'create-outline',
  color: '#3498db',
  meals: {
    Breakfast: ['Add your breakfast options'],
    Lunch: ['Add your lunch options'],
    Dinner: ['Add your dinner options'],
    Snacks: ['Add your snack options'],
  },
};