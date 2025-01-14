class Cleanse {
  constructor(props) {
    this._id = props._id;
    this.description = props.description;
    this.image = props.image;
    this.type = props.type;
    this.name = props.name;
    this.value = props.value;
  }

  static name(potency) {
    if (potency === '') {
      return 'Purification Potion';
    } else {
      return 'Purification Potion';
    }
  }

  static purify() {
    // Este método puede implementarse según tus necesidades
    console.log('Purifying...');
  }
}

module.exports = Cleanse;