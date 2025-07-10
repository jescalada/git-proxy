import * as Diff2Html from 'diff2html';
import parse from 'html-react-parser';

export default function Diff(props) {
  const { diff } = props;
  const outputHtml = Diff2Html.html(diff, {
    drawFileList: true,
    matching: 'lines',
  });

  return <>{parse(outputHtml)}</>;
}
