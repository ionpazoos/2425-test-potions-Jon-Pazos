const Antidote = require('./Antidote');
const Elixir = require('./Elixir');
const Essence = require('./Essence');
const Poison = require('./Poison');
const Stench = require('./Stench');
const Venom = require('./Venom');
const Cleanse = require('./Cleanse');

class Potion {
  constructor(props) {
    this._id = props._id;
    this.description = props.description;
    this.image = props.image;
    this.type = props.type;
    this.name = props.name;
    this.value = props.value;
    this.modifiers = props.modifiers;
  }

  static create(ingredients, curses) {
    let value = calculateValue(ingredients);
    let description;
    let image = 'assets/animations/potion.gif';
    let type = 'Potion';
    let curse = seekCurse(ingredients, curses);
    let modifiers = null;
    let duration = 0;

    if (curse) {
      modifiers = curse.modifiers;
    }
    console.log('MODIFIERS:', modifiers);

    let id = 'id';
    let effectsArray = [];

    for (let i = 0; i < ingredients.length; i++) {
      const categorizedEffect = categorizeEffect(ingredients[i].effects[0]);
      effectsArray.push(categorizedEffect);
    }

    let selectedPotency = checkIngredientCompatibility(effectsArray);
    let lowerPotency = selectedPotency.potency;
    description = ingredients[0].description;
    if (lowerPotency === 'nothing') {
      lowerPotency = '';
    }
    let potion_name = '';

    console.log('Effects Array:', effectsArray);

    if (effectsArray.every((element) => element.effect === effectsArray[0].effect)) {
      console.log('SAME EFFECT');
      if (!curse && (effectsArray[0].effect === 'restore' || effectsArray[0].effect === 'damage')) {
        potion_name = 'Failed Potion';
        type = 'Failed Potion';
        value = 1;
        description = 'A failed potion, do not consume.';
        return new Potion({
          _id: id,
          name: potion_name,
          description: description,
          image: image,
          type: type,
          value: value,
          modifiers: modifiers,
        });
      } else {
        switch (effectsArray[0].effect) {
          case 'increase':
            potion_name = Essence.name(lowerPotency);
            type = 'Essence';
            let heal = Essence.calculateMod(effectsArray);
            return new Essence({ _id: id, name: potion_name, description, image, type, value, heal });

          case 'decrease':
            potion_name = Stench.name(lowerPotency);
            type = 'Stench';
            let damage = Stench.calculateMod(effectsArray);
            return new Stench({ _id: id, name: potion_name, description, image, type, value, damage });

          case 'calm':
            potion_name = `${lowerPotency} ${effectsArray[0].effect} elixir`;
            type = 'Elixir';
            modifiers = Elixir.calculateMod(effectsArray);
            duration = Elixir.calculateDuration(effectsArray);
            return new Elixir({ _id: id, name: potion_name, description, image, type, value, modifiers, duration });

          case 'frenzy':
            potion_name = `${lowerPotency} ${effectsArray[0].effect} venom`;
            type = 'Venom';
            modifiers = Venom.calculateMod(effectsArray);
            duration = Venom.calculateDuration(effectsArray);
            return new Venom({ _id: id, name: potion_name, description, image, type, value, modifiers, duration });

          case 'boost':
            potion_name = `${lowerPotency} ${effectsArray[0].attribute} elixir`;
            type = 'Elixir';
            modifiers = Elixir.calculateMod(effectsArray);
            duration = Elixir.calculateDuration(effectsArray);
            return new Elixir({ _id: id, name: potion_name, description, image, type, value, modifiers, duration });

          case 'setback':
            potion_name = `${lowerPotency} ${effectsArray[0].attribute} venom`;
            type = 'Venom';
            modifiers = Venom.calculateMod(effectsArray);
            duration = Elixir.calculateDuration(effectsArray);
            return new Venom({ _id: id, name: potion_name, description, image, type, value, modifiers, duration });

          case 'restore':
            potion_name = `${lowerPotency} Antidote of ${curse?.name}`;
            type = 'Antidote';
            return new Antidote({ _id: id, name: potion_name, description, image, type, value, modifiers });

          case 'damage':
            potion_name = `${lowerPotency} Poison of ${curse?.name}`;
            type = 'Poison';
            return new Poison({ _id: id, name: potion_name, description, image, type, value, modifiers });

          case 'cleanse':
            potion_name = Cleanse.name(lowerPotency);
            type = 'Cleanse';
            return new Cleanse({ _id: id, name: potion_name, description, image, type, value });

          default:
            potion_name = 'Failed Potion';
            type = 'Failed Potion';
            value = 1;
            description = 'A failed potion, do not consume.';
            return new Potion({ _id: id, name: potion_name, description, image, type, value, modifiers });
        }
      }
    } else {
      console.log('NOT THE SAME EFFECT');
      potion_name = 'Failed Potion';
      type = 'Failed Potion';
      value = 1;
      description = 'A failed potion, do not consume.';
      return new Potion({ _id: id, name: potion_name, description, image, type, value, modifiers });
    }
  }
}

function calculateValue(ingredients) {
  return ingredients.reduce((total, ingredient) => total + ingredient.value, 0);
}

function seekCurse(ingredients, curses) {
  const ingredientEffects = ingredients.flatMap((ingredient) => ingredient.effects);
  return curses.find(
    (curse) =>
      curse.poison_effects.every((effect) => ingredientEffects.includes(effect)) ||
      curse.antidote_effects.every((effect) => ingredientEffects.includes(effect))
  ) || null;
}

function categorizeEffect(str) {
  const parts = str.split('_');
  let potency = parts[0];             // 'lesser'
  let effect = parts[1] || 'unknown'; // 'restore'
  let attribute = parts[2] || null;   // 'constitution' o null
  return { potency, effect, attribute };
}

function checkIngredientCompatibility(effects) {
  return effects.reduce((lowest, current) =>
    potencyTiers[current.potency] < potencyTiers[lowest.potency] ? current : lowest
  );
}

const potencyTiers = {
  least: 0,
  lesser: 1,
  nothing: 2,
  greater: 3,
};

module.exports = Potion;