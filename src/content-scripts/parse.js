import CompGenerator from '../parsers/CompGenerator'
import parsers from '../parsers'


new CompGenerator({ parser: parsers(document) }).parse()
