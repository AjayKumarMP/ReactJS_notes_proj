import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

//import chaiThings from 'chai-things'

//chai.should();
chai.use(sinonChai)
chai.use(chaiEnzyme())