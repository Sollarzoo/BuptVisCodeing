//弦图布局函数
      d3.layout.chord = function() {
      var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
      function relayout() {
        var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
        chords = [];
        groups = [];
        k = 0, i = -1;
        while (++i < n) {
          x = 0, j = -1;
          while (++j < n) {
            x += matrix[i][j];
          }
          groupSums.push(x);
          subgroupIndex.push(d3.range(n));
          k += x;
        }
        if (sortGroups) {
          groupIndex.sort(function(a, b) {
            return sortGroups(groupSums[a], groupSums[b]);
          });
        }
        if (sortSubgroups) {
          subgroupIndex.forEach(function(d, i) {
            d.sort(function(a, b) {
              return sortSubgroups(matrix[i][a], matrix[i][b]);
            });
          });
        }
        k = (τ - padding * n) / k;
        x = 0, i = -1;
        while (++i < n) {
          x0 = x, j = -1;
          while (++j < n) {
            var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
            subgroups[di + "-" + dj] = {
              index: di,
              subindex: dj,
              startAngle: a0,
              endAngle: a1,
              value: v
            };
          }
          groups[di] = {
            index: di,
            startAngle: x0,
            endAngle: x,
            value: groupSums[di]
          };
          x += padding;
        }
        i = -1;
        while (++i < n) {
          j = i - 1;
          while (++j < n) {
            var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
            if (source.value || target.value) {
              chords.push(source.value < target.value ? {
                source: target,
                target: source
              } : {
                source: source,
                target: target
              });
            }
          }
        }
        if (sortChords) resort();
      }
      function resort() {
        chords.sort(function(a, b) {
          return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
        });
      }
      chord.matrix = function(x) {
        if (!arguments.length) return matrix;
        n = (matrix = x) && matrix.length;
        chords = groups = null;
        return chord;
      };
      chord.padding = function(x) {
        if (!arguments.length) return padding;
        padding = x;
        chords = groups = null;
        return chord;
      };
      chord.sortGroups = function(x) {
        if (!arguments.length) return sortGroups;
        sortGroups = x;
        chords = groups = null;
        return chord;
      };
      chord.sortSubgroups = function(x) {
        if (!arguments.length) return sortSubgroups;
        sortSubgroups = x;
        chords = null;
        return chord;
      };
      chord.sortChords = function(x) {
        if (!arguments.length) return sortChords;
        sortChords = x;
        if (chords) resort();
        return chord;
      };
      chord.chords = function() {
        if (!chords) relayout();
        return chords;
      };
      chord.groups = function() {
        if (!groups) relayout();
        return groups;
      };
      return chord;
    };
//弧生成器
d3.svg.arc = function() {
      var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
      function arc() {
        console.log(arguments)
        var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
        if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
        if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
        var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
        if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
          rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
          if (!cw) p1 *= -1;
          if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
          if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
        }
        if (r1) {
          x0 = r1 * Math.cos(a0 + p1);
          y0 = r1 * Math.sin(a0 + p1);
          x1 = r1 * Math.cos(a1 - p1);
          y1 = r1 * Math.sin(a1 - p1);
          var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
          if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
            var h1 = (a0 + a1) / 2;
            x0 = r1 * Math.cos(h1);
            y0 = r1 * Math.sin(h1);
            x1 = y1 = null;
          }
        } else {
          x0 = y0 = 0;
        }
        if (r0) {
          x2 = r0 * Math.cos(a1 - p0);
          y2 = r0 * Math.sin(a1 - p0);
          x3 = r0 * Math.cos(a0 + p0);
          y3 = r0 * Math.sin(a0 + p0);
          var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
          if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
            var h0 = (a0 + a1) / 2;
            x2 = r0 * Math.cos(h0);
            y2 = r0 * Math.sin(h0);
            x3 = y3 = null;
          }
        } else {
          x2 = y2 = 0;
        }
        if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
          cr = r0 < r1 ^ cw ? 0 : 1;
          var rc1 = rc, rc0 = rc;
          if (da < π) {
            var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
            rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
            rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
          }
          if (x1 != null) {
            var t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
            if (rc === rc1) {
              path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
            } else {
              path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
            }
          } else {
            path.push("M", x0, ",", y0);
          }
          if (x3 != null) {
            var t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
            if (rc === rc0) {
              path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
            } else {
              path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
            }
          } else {
            path.push("L", x2, ",", y2);
          }
        } else {
          path.push("M", x0, ",", y0);
          if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
          path.push("L", x2, ",", y2);
          if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
        }
        path.push("Z");
        return path.join("");
      }
      function circleSegment(r1, cw) {
        return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
      }
      arc.innerRadius = function(v) {
        if (!arguments.length) return innerRadius;
        innerRadius = d3_functor(v);
        return arc;
      };
      arc.outerRadius = function(v) {
        if (!arguments.length) return outerRadius;
        outerRadius = d3_functor(v);
        return arc;
      };
      arc.cornerRadius = function(v) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = d3_functor(v);
        return arc;
      };
      arc.padRadius = function(v) {
        if (!arguments.length) return padRadius;
        padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
        return arc;
      };
      arc.startAngle = function(v) {
        if (!arguments.length) return startAngle;
        startAngle = d3_functor(v);
        return arc;
      };
      arc.endAngle = function(v) {
        if (!arguments.length) return endAngle;
        endAngle = d3_functor(v);
        return arc;
      };
      arc.padAngle = function(v) {
        if (!arguments.length) return padAngle;
        padAngle = d3_functor(v);
        return arc;
      };
      arc.centroid = function() {
        var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
        return [ Math.cos(a) * r, Math.sin(a) * r ];
      };
      return arc;
    };
//弦生成器
d3.svg.chord = function() {
      var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
      function chord(d, i) {
        var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
        return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
      }
      function subgroup(self, f, d, i) {
        var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
        return {
          r: r,
          a0: a0,
          a1: a1,
          p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
          p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
        };
      }
      function equals(a, b) {
        return a.a0 == b.a0 && a.a1 == b.a1;
      }
      function arc(r, p, a) {
        return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
      }
      function curve(r0, p0, r1, p1) {
        return "Q 0,0 " + p1;
      }
      chord.radius = function(v) {
        if (!arguments.length) return radius;
        radius = d3_functor(v);
        return chord;
      };
      chord.source = function(v) {
        if (!arguments.length) return source;
        source = d3_functor(v);
        return chord;
      };
      chord.target = function(v) {
        if (!arguments.length) return target;
        target = d3_functor(v);
        return chord;
      };
      chord.startAngle = function(v) {
        if (!arguments.length) return startAngle;
        startAngle = d3_functor(v);
        return chord;
      };
      chord.endAngle = function(v) {
        if (!arguments.length) return endAngle;
        endAngle = d3_functor(v);
        return chord;
      };
      return chord;
    };
   