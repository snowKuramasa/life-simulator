#!/usr/bin/env bash
set -o errexit

# Render の build 時に Rails を本番起動できる状態へ整えるスクリプトです。
# 依存 gem の導入、bootsnap の事前コンパイル、DB migration をまとめて実行します。

bundle install

# 本番起動を少しでも軽くするため、bootsnap のキャッシュを事前作成します。
bundle exec bootsnap precompile --gemfile
bundle exec bootsnap precompile app/ lib/

# Free プランでは pre-deploy command が使えないため、migration は build 時に実行します。
bundle exec rails db:migrate
