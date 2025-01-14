class Venom {
  constructor(props) {
    this._id = props._id;
    this.description = props.description;
    this.image = props.image;
    this.type = props.type;
    this.name = props.name;
    this.value = props.value;
    this.modifiers = props.modifiers;
    this.duration = props.duration;
  }

  static calculateMod(effectArray) {
    let modifiers = {
      hit_points: 0,
      intelligence: 0,
      dexterity: 0,
      insanity: 0,
      charisma: 0,
      constitution: 0,
      strength: 0,
    };

    if (effectArray.every(element => element.attribute === effectArray[0].attribute)) {
      let attributeName = effectArray[0].attribute;
      let potencyArray = [];

      effectArray.forEach(effect => {
        let potencyValue = 0;
        const { attribute } = effect;
        switch (effect.potency) {
          case 'least':
            potencyValue = 5;
            potencyArray.push(potencyValue);
            break;
          case 'lesser':
            potencyValue = 10;
            potencyArray.push(potencyValue);
            break;
          case 'greater':
            potencyValue = 20;
            potencyArray.push(potencyValue);
            break;
          default: // no potency or unknown
            potencyValue = 15;
            potencyArray.push(potencyValue);
            break;
        }

        let n = media(potencyArray);
        n = round(n);

        if (modifiers.hasOwnProperty(attribute)) {
          modifiers[attribute] = n;
        }
      });

      if (attributeName === 'insanity') {
        modifiers[attributeName] = +modifiers[attributeName];
      }

      console.log('MODIFIERS OF VENOM:', modifiers);
      return modifiers;
    }
  }

  static calculateDuration(effectArray) {
    let duration = 0;

    if (effectArray.every(element => element.attribute === effectArray[0].attribute)) {
      effectArray.forEach(effect => {
        switch (effect.potency) {
          case 'least':
            duration += 1;
            break;
          case 'lesser':
            duration += 1;
            break;
          case 'greater':
            duration += 3;
            break;
          default: // no potency or unknown
            duration += 2;
            break;
        }
      });

      console.log('DURATION OF VENOM:', duration);
      return duration;
    }
  }
}

function round(value) {
  return Math.floor(value / 5) * 5;
}

function media(potencyArray) {
  let sum = potencyArray.reduce((previous, current) => current + previous, 0);
  return sum / potencyArray.length;
}

module.exports = Venom;