class Antidote {
  constructor(props) {
    this._id = props._id;
    this.description = props.description;
    this.image = props.image;
    this.type = props.type;
    this.name = props.name;
    this.value = props.value;
    this.modifiers = props.modifiers;
  }

  static calculateMod(effectArray) {
    let totalValue = 0;

    effectArray.forEach(effect => {
      let potencyValue = 0;

      switch (effect.potency) {
        case 'least':
          potencyValue = getRandomValue(1, 5);
          break;
        case 'lesser':
          potencyValue = getRandomValue(6, 9);
          break;
        case 'greater':
          potencyValue = getRandomValue(14, 15);
          break;
        default: // no potency or unknown
          potencyValue = getRandomValue(10, 13);
          break;
      }

      totalValue += potencyValue;
    });

    return totalValue;
  }
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Antidote;