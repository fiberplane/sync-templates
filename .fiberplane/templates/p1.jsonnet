// For documentation on Fiberplane Templates, see: https://docs.fiberplane.com/templates
local fp = import 'fiberplane.libsonnet';
local c = fp.cell;
local fmt = fp.format;

function(
  title='WE GOT P1 PPL'
)
  fp.notebook
  .new(title)
  .setTimeRangeRelative(minutes=60)
  .addLabels({})
  .addCells([
    c.h1('This is a section'),
    c.text('You can add any types of cells and pre-fill content'),
  ])
  