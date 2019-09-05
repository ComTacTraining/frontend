import React, { Component } from 'react';

export class Evaluation extends Component {
  state = {
    voices: []
  };

  componentDidMount() {
    this.evaluate();
  }

  evaluate() {
    const { initialReportComplete, threeSixtyComplete } = this.props;
    if (!initialReportComplete) {
      this.initialReportEvaluation();
    } else if (!threeSixtyComplete) {
      console.log('Secondary Report()');
      this.threeSixtyEvaluation();
    }
  }

  initialReportEvaluation() {
    const { transcript } = this.props;
    let { initialMatched, slicerMatched, rectoMatched } = this.props;
    if (transcript !== undefined) {
      let initialDictionary = [];
      initialDictionary[0] = [
        'Small',
        'small',
        'Medium',
        'Large',
        'Extra Large',
        'Mega',
        'Square Feet',
        'Dimentions 50 by 120'
      ];
      initialDictionary[1] = [
        'Single Story',
        '2 Story',
        'two-story',
        'two story',
        'double story',
        'double-story',
        'Three story',
        'Three-story',
        '3 Story',
        'Mid Rise',
        'High Rise',
        'High-rise'
      ];
      initialDictionary[2] = [
        'Residential',
        'single-family dwelling',
        'single family dwelling',
        'single families',
        'multi family dwelling',
        'garden apartment',
        'call apartment',
        'townhome',
        'town home',
        'condominium',
        'duplex',
        'business office',
        'warehouse',
        'medical office',
        'retail',
        'Apartment',
        'House',
        'Single Family Dwelling',
        'Townhome',
        'Center Hall',
        'Commercial',
        'Office',
        'Taxpayer',
        'Condo',
        'Condominium',
        'Industrial',
        'Metal building',
        'Warehouse',
        'Tiltup',
        'Home',
        'Retail'
      ];
      initialDictionary[3] = [
        'Smoke',
        'Smoke showing',
        'fire showing',
        'smoke and fire showing',
        'nothing showing',
        'Fire',
        'Nothing'
      ];
      initialDictionary[4] = [
        'Laying a supply line',
        'establishing water supply',
        'entering the rescue mode',
        'quick attack',
        'command',
        'investigation',
        'Water Supply',
        'Laying Lines',
        'Investigating',
        'Command',
        'Rescue',
        'attack lines'
      ];
      initialDictionary[5] = [
        'Second alarm',
        'third alarm',
        'police',
        'PD',
        'ambulance',
        'public works',
        '2nd Alarm',
        'Police',
        'Ambulance',
        'EMS',
        'Officers'
      ];
      initialDictionary[6] = [
        'Main Street command',
        'Main Street incident',
        'main street IC',
        'men straight incident',
        'men straight',
        'usually bear is the name of the street that the incident is on',
        'Consistent with the address'
      ];
      initialDictionary[7] = [
        'Typical light weight construction',
        'lightweight',
        'ordinary construction',
        'cut and stack construction',
        'poured in place',
        '360 degree assessment',
        '360 degree ',
        '360',
        'concrete tilt up',
        'metal clad building',
        'stack conception'
      ];
      const rescueDictionary = ['Rescue', 'search'];
      const salvageDictionary = [
        'salvage',
        'recovery',
        'property',
        'property conservation'
      ];
      console.log('TRANSCRIPT EVALUATION + ' + transcript);

      for (var i = 0; i < initialDictionary.length; i++) {
        initialMatched[i] = {};
        initialMatched[i].keywords = [];
        initialMatched[i].keywords = initialDictionary[i];
        initialMatched[i].matched = 0;
        initialMatched[i].matchKeyword = '';
      }
      console.log('TRANS is' + transcript);

      initialDictionary.forEach((elem, index) => {
        elem.forEach(item => {
          var re = new RegExp(item, 'gi');
          if (transcript.match(re)) {
            initialMatched[index].matched = 1;
            initialMatched[index].matchKeyword = item;
          }
        });
      });

      for (i = 0; i <= 6; i++) {
        slicerMatched[i] = {};
        slicerMatched[i].matched = 0;
        slicerMatched[i].matchKeyword = '';

        rectoMatched[i] = {};
        rectoMatched[i].matched = 0;
        rectoMatched[i].matchKeyword = '';
      } //Initialize SLICER and RECTO-VS array

      rescueDictionary.forEach(item => {
        var re = new RegExp(item, 'gi');
        if (transcript.match(re)) {
          slicerMatched[5].matched = 1;
          slicerMatched[5].matchKeyword = item;

          rectoMatched[0].matched = 1;
          rectoMatched[0].matchKeyword = item;
          rectoMatched[4].matched = 1;
          rectoMatched[4].matchKeyword = item;
        }
      });

      salvageDictionary.forEach(item => {
        var re = new RegExp(item, 'gi');
        if (transcript.match(re)) {
          slicerMatched[6].matched = 1;
          slicerMatched[6].matchKeyword = item;

          rectoMatched[5].matched = 1;
          rectoMatched[5].matchKeyword = item;
        }
      });

      const updates = {
        initialMatched: initialMatched,
        rectoMatched: rectoMatched,
        slicerMatched: slicerMatched
      };
      this.props.handleEvaluationComplete(updates);
    }
  }

  threeSixtyEvaluation() {
    const { transcript, initialMatched, rectoMatched } = this.props;
    let { slicerMatched, secondaryMatched } = this.props;
    if (transcript !== undefined) {
      let secondaryDictionary = [];
      secondaryDictionary[0] = ['Alpha', 'bravo', 'Charlie', 'Delta'];
      secondaryDictionary[1] = [
        'Structure fire',
        'room and contents fire',
        'room and contents. fire',
        'room and contents',
        'attic fire',
        'basement fire'
      ];
      secondaryDictionary[2] = [
        'Bidirectional',
        'unidirectional',
        'exhaust on Alpha',
        'bravo',
        'Charlie',
        'Delta',
        'intake',
        'on Alpha',
        'bravo',
        'Charlie',
        'Delta'
      ];
      secondaryDictionary[3] = [
        'survivability profile',
        'Survivability profile',
        'Positive',
        'marginal',
        'negative'
      ];
      for (var i = 0; i < secondaryDictionary.length; i++) {
        secondaryMatched[i] = {};
        secondaryMatched[i].keywords = [];
        secondaryMatched[i].keywords = secondaryDictionary[i];
        secondaryMatched[i].matched = 0;
        secondaryMatched[i].matchKeyword = '';
      }

      secondaryDictionary.forEach((elem, index) => {
        elem.forEach(item => {
          var re = new RegExp(item, 'gi');
          if (transcript.match(re)) {
            secondaryMatched[index].matched = 1;
            secondaryMatched[index].matchKeyword = item;
          }
        });
      });

      //S in SLICER
      if (
        initialMatched[0].matched &&
        initialMatched[1].matched &&
        initialMatched[2].matched &&
        secondaryMatched[0].matched
      ) {
        slicerMatched[0].matched = 1;
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword + initialMatched[0].matchKeyword + ', ';
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword + initialMatched[1].matchKeyword + ', ';
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword + initialMatched[2].matchKeyword + ', ';
        slicerMatched[0].matchKeyword =
          slicerMatched[0].matchKeyword +
          secondaryMatched[0].matchKeyword +
          ', ';
      }
      // L
      if (initialMatched[4].matched && secondaryMatched[0].matched) {
        slicerMatched[1].matched = 1;
        slicerMatched[1].matchKeyword =
          slicerMatched[1].matchKeyword + initialMatched[4].matchKeyword + ', ';
        slicerMatched[1].matchKeyword =
          slicerMatched[1].matchKeyword +
          secondaryMatched[0].matchKeyword +
          ', ';
      }
      // I
      if (secondaryMatched[1].matched) {
        slicerMatched[2].matched = 1;
        slicerMatched[2].matchKeyword =
          slicerMatched[2].matchKeyword +
          secondaryMatched[10].matchKeyword +
          ', ';
      }

      const updates = {
        initialMatched: initialMatched,
        rectoMatched: rectoMatched,
        slicerMatched: slicerMatched,
        secondaryMatched: secondaryMatched
      };
      this.props.handleEvaluationComplete(updates);
      console.dir(initialMatched);
      console.dir(secondaryMatched);
      console.dir(slicerMatched);
      console.dir(rectoMatched);
    }
  }

  render() {
    return <div>Evaluation</div>;
  }
}
