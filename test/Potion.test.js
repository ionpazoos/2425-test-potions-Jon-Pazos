// test/Potion.test.js
const axios = require('axios');
const Potion = require('../Potions/Potion.js');

describe('Cuando Todos los ingredientes llevan efecto restore', () => {
  let allIngredients;
  let allDiseases;

  beforeAll(async () => {
    const ingredientsResponse = await axios.get('https://kaotika-server.fly.dev/ingredients');
    const diseasesResponse = await axios.get('https://kaotika-server.fly.dev/diseases');

    // Asumiendo que la respuesta de la API tiene la estructura { status: 'OK', data: [ ... ] }
    allIngredients = ingredientsResponse.data.data;
    allDiseases = diseasesResponse.data.data;
  });

  test('El Nombre deberia ser el correspondiente Antidote of + "nombre de la enfermedad"', () => {
    
    const selectedIngredients = [
      allIngredients[25], // “Guardian’s Essence”
      allIngredients[60], // "Enduring Root"
    ];
    console.log(allIngredients);
    
    const diseaseForTest = allDiseases.find((disease) =>
      disease.antidote_effects.includes("lesser_restore_hit_points") &&
      disease.antidote_effects.includes("lesser_restore_constitution")
    );

    const createdPotion = Potion.create(selectedIngredients, [diseaseForTest]);
    console.log('CREATED POTION:', createdPotion);

    expect(createdPotion.type).toBe('Antidote');
    expect(createdPotion.name).toContain(diseaseForTest.name);
  });

  test('Crea una pocion que no incluya restore en uno de los ingredeintes', () => {
    
    const selectedIngredients = [
      allIngredients[49], // Crimson Lotus
      allIngredients[8], // Ashen Petal
    ];

    const createdPotion = Potion.create(selectedIngredients, allDiseases);
    console.log('CREATED POTION:', createdPotion);

    expect(createdPotion.type).toBe('Failed Potion');
  });
});

describe('signo inverso en los atributos del antidoto', () => {
    let allIngredients;
    let allDiseases;
  
    beforeAll(async () => {
      const ingredientsResponse = await axios.get('https://kaotika-server.fly.dev/ingredients');
      const diseasesResponse = await axios.get('https://kaotika-server.fly.dev/diseases');
  
      allIngredients = ingredientsResponse.data.data;
      allDiseases = diseasesResponse.data.data;
    });
  
    test('los atributos tendra el valor que aparece en la enfermedad pero cambiando el signo', () => {
      const gravechill = allDiseases.find((disease) => disease.name === 'Gravechill');
      expect(gravechill).toBeDefined();
  
      const guardiansEssence = allIngredients.find((ing) =>
        ing.effects.includes('lesser_restore_hit_points')
      );
      const enduringRoot = allIngredients.find((ing) =>
        ing.effects.includes('lesser_restore_constitution')
      );
  
      expect(guardiansEssence).toBeDefined();
      expect(enduringRoot).toBeDefined();
  
      const createdPotion = Potion.create([guardiansEssence, enduringRoot], [gravechill]);
  
      expect(createdPotion.type).toBe('Antidote');
      expect(createdPotion.name).toContain(gravechill.name);

      const expectedHp   = gravechill.modifiers.hit_points * -1;  
      const expectedCons = gravechill.modifiers.constitution * -1;  
  
      expect(createdPotion.modifiers.hit_points).toBe(expectedHp);
      expect(createdPotion.modifiers.constitution).toBe(expectedCons);

    });
  });


  describe('Potion creation - Poison test', () => {
    let allIngredients;
    let allDiseases;
  
    beforeAll(async () => {
      const ingredientsResponse = await axios.get('https://kaotika-server.fly.dev/ingredients');
      const diseasesResponse = await axios.get('https://kaotika-server.fly.dev/diseases');
      allIngredients = ingredientsResponse.data.data;
      allDiseases = diseasesResponse.data.data;
    });
  
    test('should create a Poison when all ingredients have damage effects matching a disease', () => {

      const diseaseForTest = allDiseases.find((disease) =>
        disease.poison_effects.includes('lesser_damage_insanity') &&
        disease.poison_effects.includes('lesser_damage_charisma')
      );
      expect(diseaseForTest).toBeDefined();

      const damageHitPointsIng = allIngredients.find((ing) =>
        ing.effects.includes('lesser_damage_insanity')
      );
      const damageConstitutionIng = allIngredients.find((ing) =>
        ing.effects.includes('lesser_damage_charisma')
      );
  
      expect(damageHitPointsIng).toBeDefined();
      expect(damageConstitutionIng).toBeDefined();
  
      const selectedIngredients = [damageHitPointsIng, damageConstitutionIng];
  
      const createdPotion = Potion.create(selectedIngredients, [diseaseForTest]);
      console.log('CREATED POTION =>', createdPotion.type);

      expect(createdPotion.type).toBe('Poison');
      expect(createdPotion.name).toBe(`lesser Poison of ${diseaseForTest.name}`);
      expect(createdPotion.modifiers).toEqual(diseaseForTest.modifiers);
    });
  });

  describe('Potion creation - mixed effects (not all damage)', () => {
    let allIngredients;
    let allDiseases;
  
    beforeAll(async () => {
      const ingredientsResponse = await axios.get('https://kaotika-server.fly.dev/ingredients');
      const diseasesResponse = await axios.get('https://kaotika-server.fly.dev/diseases');
      allIngredients = ingredientsResponse.data.data;
      allDiseases = diseasesResponse.data.data;
    });
  
    test('should create a Failed Potion if one ingredient is damage and the other is not damage', () => {
      const damageIngredient = allIngredients.find((ing) =>
        ing.effects.includes('lesser_damage_hit_points')
      );
      const restoreIngredient = allIngredients.find((ing) =>
        ing.effects.includes('lesser_restore_hit_points')
      );

      expect(damageIngredient).toBeDefined();
      expect(restoreIngredient).toBeDefined();
  
      const selectedIngredients = [damageIngredient, restoreIngredient];
      const createdPotion = Potion.create(selectedIngredients, allDiseases);
      console.log('CREATED POTION =>', createdPotion);
      expect(createdPotion.type).toBe('Failed Potion');
    });
  });

  describe('Elixir boost tests', () => {
    let allIngredients;
  
    beforeAll(async () => {
      const ingredientsResponse = await axios.get('https://kaotika-server.fly.dev/ingredients');
      allIngredients = ingredientsResponse.data.data;
    });
  
    test('least value rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('least_boost_charisma'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('least_boost_charisma'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/charisma elixir/);
      expect(createdPotion.modifiers).toHaveProperty('charisma', 5);
    });
  
    test('least duration rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('least_boost_charisma'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('least_boost_charisma'));
      const ingredient3 = allIngredients.find((ing) => ing.effects.includes('least_boost_charisma'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      expect(ingredient3).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2, ingredient3];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/charisma elixir/);
      expect(createdPotion.duration).toBeDefined();
      expect(createdPotion.duration).toBe(1);
    });
  
    test('lesser value rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('lesser_boost_dexterity'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('lesser_boost_dexterity'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/dexterity elixir/);
      expect(createdPotion.modifiers).toHaveProperty('dexterity', 10);
    });
  
    test('lesser dex duration rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('lesser_boost_dexterity'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('lesser_boost_dexterity'));
      const ingredient3 = allIngredients.find((ing) => ing.effects.includes('lesser_boost_dexterity'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      expect(ingredient3).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2, ingredient3];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/dexterity elixir/);
      expect(createdPotion.duration).toBeDefined();
      expect(createdPotion.duration).toBe(1);
    });
  
    test('normal value rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('boost_strength'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('boost_strength'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/strength elixir/);
      expect(createdPotion.modifiers).toHaveProperty('strength', 15);
    });
  
    test('normal duration rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('boost_dexterity'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('boost_dexterity'));
      const ingredient3 = allIngredients.find((ing) => ing.effects.includes('boost_dexterity'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      expect(ingredient3).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2, ingredient3];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/dexterity elixir/);
      expect(createdPotion.duration).toBeDefined();
      expect(createdPotion.duration).toBe(2);
    });
  
    test('greater value rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('greater_boost_strength'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('greater_boost_strength'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/strength elixir/);
      expect(createdPotion.modifiers).toHaveProperty('strength', 20);
    });
  
    test('greater duration rounding', () => {
      const ingredient1 = allIngredients.find((ing) => ing.effects.includes('greater_boost_dexterity'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('greater_boost_dexterity'));
      const ingredient3 = allIngredients.find((ing) => ing.effects.includes('greater_boost_dexterity'));
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();
      expect(ingredient3).toBeDefined();
      const selectedIngredients = [ingredient1, ingredient2, ingredient3];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toMatch(/dexterity elixir/);
      expect(createdPotion.duration).toBeDefined();
      expect(createdPotion.duration).toBe(3);
    });
    test('should create an Elixir and the modifiers should be 10', () => {
        const leastBoost = allIngredients.find((ing) => ing.effects.includes('least_boost_charisma'));
        const lesserBoost = allIngredients.find((ing) => ing.effects.includes('lesser_boost_charisma'));
        const greaterBoost = allIngredients.find((ing) => ing.effects.includes('greater_boost_charisma'));
        expect(leastBoost).toBeDefined();
        expect(lesserBoost).toBeDefined();
        expect(greaterBoost).toBeDefined();
        const selectedIngredients = [leastBoost, lesserBoost, greaterBoost];
        const createdPotion = Potion.create(selectedIngredients, []);
        expect(createdPotion.type).toBe('Elixir');
        expect(createdPotion.name).toMatch(/charisma elixir/);
        expect(createdPotion.modifiers).toHaveProperty('charisma', 10);
      });

      test('should create an Elixir and the duration should be 10', () => {
        const leastBoost = allIngredients.find((ing) => ing.effects.includes('least_boost_charisma'));
        const lesserBoost = allIngredients.find((ing) => ing.effects.includes('lesser_boost_charisma'));
        const greaterBoost = allIngredients.find((ing) => ing.effects.includes('greater_boost_charisma'));
        expect(leastBoost).toBeDefined();
        expect(lesserBoost).toBeDefined();
        expect(greaterBoost).toBeDefined();
        const selectedIngredients = [leastBoost, lesserBoost, greaterBoost];
        const createdPotion = Potion.create(selectedIngredients, []);
        expect(createdPotion.type).toBe('Elixir');
        expect(createdPotion.name).toMatch(/charisma elixir/);
        expect(createdPotion.duration).toBeDefined();
        expect(createdPotion.duration).toBe(1);
      });

      test('should create a failed potion(not the same atribute)', () => {
        const leastBoost = allIngredients.find((ing) => ing.effects.includes('least_frenzy'));
        const lesserBoost = allIngredients.find((ing) => ing.effects.includes('lesser_boost_charisma'));
        const greaterBoost = allIngredients.find((ing) => ing.effects.includes('greater_boost_charisma'));
        expect(leastBoost).toBeDefined();
        expect(lesserBoost).toBeDefined();
        expect(greaterBoost).toBeDefined();
        const selectedIngredients = [leastBoost, lesserBoost, greaterBoost];
        const createdPotion = Potion.create(selectedIngredients, []);
        expect(createdPotion.type).not.toBe('Elixir');
      });
  });

  describe('Potion name format: "<modifier> <attribute> elixir" (Lesser Dex)', () => {
    let allIngredients;
  
    beforeAll(async () => {
      const ingredientsResponse = await axios.get('https://kaotika-server.fly.dev/ingredients');
      allIngredients = ingredientsResponse.data.data;
    });
  
    test('should create "lesser dexterity elixir" for ingredients with lesser_boost_dexterity', () => {
      const ingredient1 = allIngredients.find((ing) =>ing.effects.includes('lesser_boost_dexterity'));
      const ingredient2 = allIngredients.find((ing) => ing.effects.includes('lesser_boost_dexterity'));
  
      expect(ingredient1).toBeDefined();
      expect(ingredient2).toBeDefined();

      const selectedIngredients = [ingredient1, ingredient2];
      const createdPotion = Potion.create(selectedIngredients, []);
      expect(createdPotion.type).toBe('Elixir');
      expect(createdPotion.name).toBe('lesser dexterity elixir');
    });
  });

  